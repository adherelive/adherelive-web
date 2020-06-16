import * as constants from "../../../../config/constants";

const { OAuth2Client } = require("google-auth-library");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const request = require("request");
import bcrypt from "bcrypt";
import chalk from "chalk";

import Log from "../../../../libs/log";

const Response = require("../../helper/responseFormat");
import userService from "../../../services/user/user.service";
import patientService from "../../../services/patients/patients.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
// import doctorService from "../../../services/doctor/doctor.service";

import MPatientWrapper from "../../../ApiWrapper/mobile/patient";
import MUserWrapper from "../../../ApiWrapper/mobile/user";
import MDoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import MCarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";

import Controller from "../../";
import doctorService from "../../../services/doctors/doctors.service";
import qualificationService from "../../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../../services/doctorClinics/doctorClinics.service";
import documentService from "../../../services/uploadDocuments/uploadDocuments.service";
import UserVerificationServices from "../../../services/userVerifications/userVerifications.services";

import { doctorQualificationData, uploadImageS3 } from "./userHelper";
import { v4 as uuidv4 } from "uuid";
import {
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  DOCUMENT_PARENT_TYPE,
  ONBOARDING_STATUS,
} from "../../../../constant";
import { Proxy_Sdk, EVENTS } from "../../../proxySdk";
// import  EVENTS from "../../proxySdk/proxyEvents";
const errMessage = require("../../../../config/messages.json").errMessages;
import minioService from "../../../../app/services/minio/minio.service";
import md5 from "js-md5";
import UserVerifications from "../../../models/userVerifications";

const Logger = new Log("MOBILE USER CONTROLLER");

class UserController extends Controller {
  constructor() {
    super();
  }

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail({
        email,
      });

      // const userDetails = user[0];
      // console.log("userDetails --> ", userDetails);
      if (!user) {
        return this.raiseClientError(res, 422, user, "user does not exists");
      }

      // TODO: UNCOMMENT below code after signup done for password check or seeder
      const passwordMatch = await bcrypt.compare(
        password,
        user.get("password")
      );
      if (passwordMatch) {
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userId: user.get("id"),
          },
          secret,
          {
            expiresIn,
          }
        );

        return this.raiseSuccess(
          res,
          200,
          {
            accessToken,
          },
          "initial data retrieved successfully"
        );
      } else {
        return this.raiseClientError(res, 422, {}, "password not matching");
      }
    } catch (error) {
      console.log("error sign in  --> ", error);
      return this.raiseServerError(res, 500, error, error.getMessage());
    }
  };

  signUp = async (req, res) => {
    try {
      const { password, email } = req.body;
      const userExits = await userService.getUserByEmail({ email });

      console.log("CREDENTIALSSSSSSSSSSSSSS", password, email);
      if (userExits !== null) {
        const userExitsError = new Error();
        userExitsError.code = 11000;
        throw userExitsError;
      }

      let response;
      const link = uuidv4();
      const status = "verified"; //make it pending completing flow with verify permission
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      const verified = true;

      let user = await userService.addUser({
        email,
        password: hash,
        sign_in_type: "basic",
        category: "doctor",
        onboarded: false,
        verified,
        activated_on: moment(),
      });

      const userInfo = await userService.getUserByEmail({ email });

      const userVerification = UserVerificationServices.addRequest({
        user_id: userInfo.get("id"),
        request_id: link,
        status: "pending",
      });
      let uId = userInfo.get("id");

      console.log(
        "CREDENTIALSSSSSSSSSSSSSS111111111111",
        "      1234567890          ",
        userInfo.get("id")
      );
      const emailPayload = {
        title: "Verification mail",
        toAddress: email,
        templateName: EMAIL_TEMPLATE_NAME.WELCOME,
        templateData: {
          title: "Doctor",
          link: process.config.app.invite_link + link,
          inviteCard: "",
          mainBodyText: "We are really happy that you chose us.",
          subBodyText: "Please verify your account",
          buttonText: "Verify",
          host: process.config.WEB_URL,
          contactTo: "patientEngagement@adhere.com",
        },
      };

      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

      const secret = process.config.TOKEN_SECRET_KEY;
      const accessToken = await jwt.sign(
        {
          userId: user.get("id"),
        },
        secret,
        {
          expiresIn,
        }
      );

      return this.raiseSuccess(
        res,
        200,
        {
          accessToken,
        },
        "Sign up successfull"
      );
    } catch (err) {
      console.log("signup err,", err);
      if (err.code && err.code == 11000) {
        let response = new Response(false, 400);
        console.log(
          "Sign ka hai -----------> , ",
          errMessage.EMAIL_ALREADY_EXISTS
        );
        response.setError(errMessage.EMAIL_ALREADY_EXISTS);
        return res.status(400).json(response.getResponse());
      } else {
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
      }
    }
  };

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail({
        email,
      });

      // const userDetails = user[0];
      // console.log("userDetails --> ", userDetails);
      if (!user) {
        return this.raiseClientError(res, 422, user, "user does not exists");
      }

      let verified = user.get("verified");

      if (!verified) {
        return this.raiseClientError(res, 401, "user account not verified");
      }

      // TODO: UNCOMMENT below code after signup done for password check or seeder
      const passwordMatch = await bcrypt.compare(
        password,
        user.get("password")
      );
      if (passwordMatch) {
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userId: user.get("id"),
          },
          secret,
          {
            expiresIn,
          }
        );

        return this.raiseSuccess(
          res,
          200,
          {
            accessToken,
          },
          "initial data retrieved successfully"
        );
      } else {
        return this.raiseClientError(res, 422, {}, "password not matching");
      }
    } catch (error) {
      console.log("error sign in  --> ", error);
      return this.raiseServerError(res, 500, error, error.getMessage());
    }
    //   );

    //   console.log("access token combines --> ", accessTokenCombined);

    //   // res.cookie("accessToken", accessTokenCombined);

    //   let response = new Response(true, 200);
    //   response.setMessage("Sign in successful!");
    //   response.setData({
    //     accessToken: accessTokenCombined,
    //   });
    //   return res.status(response.getStatusCode()).send(response.getResponse());
    // } catch (err) {
    //   console.log("error ======== ", err);
    //   //throw err;
    //   let response = new Response(false, 500);
    //   response.setMessage("Sign in Unsuccessful!");
    //   return res.status(response.getStatusCode()).send(response.getResponse());
    // }
  };

  async signInFacebook(req, res) {
    const { accessToken } = req.body;

    try {
      request(
        `https://graph.facebook.com/v2.3/oauth/access_token?grant_type=fb_exchange_token&client_id=3007643415948147&client_secret=60d7c3e6dc4aae01cd9096c2749fc5c1&fb_exchange_token=${accessToken}`,
        { json: true },
        (err, res, body) => {
          if (err) {
            return console.log(err);
          }
          console.log("body ======== ", res.body.access_token);
          console.log(res.body.access_token);
        }
      );
      let response = new Response(true, 200);
      response.setMessage("Sign in successful!");
      response.setData({
        accessToken: res.body.access_token,
      });
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      useruser;
      throw err;
    }
  }

  onAppStart = async (req, res, next) => {
    console.log(
      "--------------------CHALK-------------------",
      req.userDetails
    );
    let response;
    try {
      if (req.userDetails.exists) {
        const {
          userId,
          userData,
          userData: { category } = {},
        } = req.userDetails;
        // const user = await userService.getUserById(userId);

        // const userApiWrapper = await MUserWrapper(userData);

        // const userDetails = user[0];
        Logger.debug("category", category);
        let userCategoryData = {};
        let userApiData = {};
        let carePlanApiData = {};
        let userCategoryApiData = null;
        let userCategoryId = "";
        let careplanData = [];
        let doctorIds = [];
        let userIds = [userId];

        switch (category) {
          case USER_CATEGORY.PATIENT:
            userCategoryData = await patientService.getPatientByUserId(userId);
            userCategoryApiData = await MPatientWrapper(userCategoryData);
            userCategoryId = userCategoryApiData.getPatientId();

            careplanData = await carePlanService.getCarePlanByData({
              patient_id: userCategoryId,
            });

            Logger.debug("careplan mobile", careplanData);

            await careplanData.forEach(async (carePlan) => {
              const carePlanApiWrapper = await MCarePlanWrapper(carePlan);
              doctorIds.push(carePlanApiWrapper.getDoctorId());
              carePlanApiData[
                carePlanApiWrapper.getCarePlanId()
              ] = carePlanApiWrapper.getBasicInfo();
            });
            break;
          case USER_CATEGORY.DOCTOR:
            userCategoryData = await doctorService.getDoctorByData({
              user_id: userId,
            });
            userCategoryApiData = await MDoctorWrapper(userCategoryData);
            userCategoryId = userCategoryApiData.getDoctorId();
            break;
          default:
            userCategoryData = await patientService.getPatientByData({
              user_id: userId,
            });
            userCategoryApiData = await MPatientWrapper(userCategoryData);
            userCategoryId = userCategoryApiData.getPatientId();
        }

        Logger.debug("doctor ids --> ", doctorIds);

        const doctorData = await doctorService.getDoctorByData({
          id: doctorIds,
        });

        let doctorApiDetails = {};

        await doctorData.forEach(async (patient) => {
          const doctorWrapper = await MDoctorWrapper(patient);
          doctorApiDetails[
            doctorWrapper.getDoctorId()
          ] = doctorWrapper.getBasicInfo();
          userIds.push(doctorWrapper.getUserId());
        });

        // Logger.debug("userIds --> ", userIds);

        if (userIds.length > 1) {
          const allUserData = await userService.getUserByData({ id: userIds });
          await allUserData.forEach(async (user) => {
            const apiUserDetails = await MUserWrapper(user.get());
            userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();
          });
        } else {
          const apiUserDetails = await MUserWrapper(userData);
          userApiData[
            apiUserDetails.getUserId()
          ] = apiUserDetails.getBasicInfo();
        }

        const dataToSend = {
          users: {
            ...userApiData,
          },
          [`${category}s`]: {
            [userCategoryId]: {
              ...userCategoryApiData.getBasicInfo(),
            },
          },
          doctors: {
            ...doctorApiDetails,
          },
          care_plans: {
            ...carePlanApiData
          }
        };

        return this.raiseSuccess(res, 200, { ...dataToSend }, "basic info");

        // response = new Response(true, 200);
        // response.setData({
        //     _id: userId,
        //     users: {
        //         [userId]: {
        //             basicInfo,
        //         }
        //     }
        // });userDetails
        // response.setMessage("Basic info");
        // return resaccessToken
        //     .status(response.getStatusCode())
        //     .send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      console.log("ON APP START API ERROR ", err);

      response = new Response(false, 500);
      response.setError(err.getMessage);
      return res.status(500).json(response.getResponse());
    }
  };

  signOut = async (req, res) => {
    try {
    } catch (error) {
      console.log("MOBILE SIGN OUT CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  uploadImage = async (req, res) => {
    const { userDetails, body } = req;
    const { userId = "3" } = userDetails || {};
    console.log("BODYYYYYYYYYYYYYYYY", req.file);
    const file = req.file;
    // const fileExt= file.originalname.replace(/\s+/g, '');
    try {
      //   await minioService.createBucket();

      //   const imageName = md5(`${userId}-education-pics`);

      //   let hash = md5.create();

      //   hash.hex();
      //   hash = String(hash);

      //   const folder = "adhere";
      //   // const file_name = hash.substring(4) + "_Education_"+fileExt;
      //   const file_name = hash.substring(4) + "/" + imageName + "." + fileExt;

      //   const metaData = {
      //     "Content-Type":
      //         "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      // };
      // const fileUrl = folder+ "/" +file_name;
      // await minioService.saveBufferObject(file.buffer, file_name, metaData);

      // // console.log("file urlll: ", process.config.minio.MINI);
      // const file_link = process.config.minio.MINIO_S3_HOST +"/" + fileUrl;
      // let files = [file_link];
      // console.log("Uplaoded File Url ---------------------->  ", file_link);
      // console.log("User Controllers =------------------->   ", files);
      //const resume_link = process.config.BASE_DOC_URL + files[0]
      let files = await uploadImageS3(userId, file);
      return this.raiseSuccess(
        res,
        200,
        {
          files: files,
        },
        "files uploaded successfully"
      );
    } catch (error) {
      console.log("FILE UPLOAD CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  doctorProfileRegister = async (req, res) => {
    let { name, city, category, mobile_number, prefix, profile_pic } = req.body;
    let doctorName = name.split(" ");

    const { userId: user_id } = req.params;
    try {
      let user = await userService.getUserById(user_id);
      let user_data_to_update = {
        category,
        mobile_number,
        prefix,
        onboarding_status: ONBOARDING_STATUS.PROFILE_REGISTERED,
      };
      console.log("USERRRRRRRR1111111", user_data_to_update);
      console.log("REQUESTTTTTTTT BODYYYYYY", req.body);

      let doctor = {};
      console.log("USERRRRRRRR", updatedUser);
      let doctorExist = await doctorService.getDoctorByUserId(user_id);
      // console.log('DOCTORRRRR EXISTTT',doctorExist.get('id'),doctorExist.getBasicInfo);
      let first_name = doctorName[0];
      let middle_name = doctorName.length == 3 ? doctorName[1] : "";
      let last_name =
        doctorName.length == 3
          ? doctorName[2]
          : doctorName.length == 2
          ? doctorName[1]
          : "";
      if (doctorExist) {
        let doctor_data = {
          city,
          profile_pic,
          first_name,
          middle_name,
          last_name,
          address: city,
        };
        let doctor_id = doctorExist.get("id");
        doctor = await doctorService.updateDoctor(doctor_data, doctor_id);
        console.log("DOCTORRRRRIFFFFFF", doctor, doctor.getBasicInfo);
      } else {
        let doctor_data = {
          user_id,
          city,
          profile_pic,
          first_name,
          middle_name,
          last_name,
          address: city,
        };
        doctor = await doctorService.addDoctor(doctor_data);
        console.log("DOCTORRRRRELSEEEEE", doctor, doctor.getBasicInfo);
      }
      let updatedUser = await userService.updateUser(
        user_data_to_update,
        user_id
      );
      return this.raiseSuccess(
        res,
        200,
        {
          doctor,
        },
        "doctor profile updated successfully"
      );
    } catch (error) {
      console.log("DOCTOR REGISTER CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  getDoctorProfileRegisterData = async (req, res) => {
    // let{user_id,name,city,category,mobile_number,prefix,profile_pic}=req.body;
    let { userId } = req.params;
    try {
      let name = "";
      let email = "";
      let city = "";
      let category = "";
      let prefix = "";
      let mobile_number = "";
      let profile_pic = "";

      let user = await userService.getUserById(userId);
      // console.log("GET PROFILE DATA USERRRRRRR",user.getBasicInfo);
      let userInfo = user.getBasicInfo;
      const {
        email: eMail = "",
        category: docCategory = "",
        mobile_number: mobNo = "",
        prefix: pre = "",
      } = userInfo;

      email = eMail;
      category = docCategory;
      prefix = pre;
      mobile_number = mobNo;

      let doctor = await doctorService.getDoctorByUserId(userId);
      // console.log('GET PROFILE DATA USERRRRRRR',doctor.get('id'),doctor.getBasicInfo);

      if (doctor) {
        let docInfo = doctor.getBasicInfo;
        const {
          first_name = "",
          middle_name = "",
          last_name = "",
          city: docCity = "",
          profile_pic: docPic = "",
        } = docInfo || {};
        name =
          first_name + " " + `${middle_name && middle_name + " "}` + last_name;

        city = docCity;
        profile_pic = docPic;
      }

      const profileData = {
        name,
        city,
        category,
        mobile_number,
        prefix,
        profile_pic,
        email,
      };

      // console.log('FINAL+++================>',profileData);

      return this.raiseSuccess(
        res,
        200,
        {
          profileData,
        },
        " get doctor profile successfull"
      );
    } catch (error) {
      console.log("DOCTOR REGISTER CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  doctorQualificationRegister = async (req, res) => {
    let {
      speciality = "",
      gender = "",
      registration_number = "",
      registration_council = "",
      registration_year = "",
      qualification_details = [],
    } = req.body;

    const { userId: user_id } = req.params;
    try {
      let user = userService.getUserById(user_id);
      let user_data_to_update = {
        onboarding_status: ONBOARDING_STATUS.QUALIFICATION_REGISTERED,
      };
      let doctor = await doctorService.getDoctorByUserId(user_id);
      let doctor_id = doctor.get("id");
      let doctor_data = {
        gender,
        registration_number,
        registration_council,
        registration_year,
        speciality,
      };
      let updatedDoctor = await doctorService.updateDoctor(
        doctor_data,
        doctor_id
      );
      let qualificationsOfDoctor = await qualificationService.getQualificationsByDoctorId(
        doctor_id
      );

      let newQualifications = [];
      for (let item of qualification_details) {
        let {
          degree = "",
          year = "",
          college = "",
          photos = [],
          id = 0,
        } = item;
        console.log("QUALIFICATIONS ITEMMMMMMMMMMMMMMMM", item, id);
        if (id && id != "0") {
          let qualification = await qualificationService.updateQualification(
            { doctor_id, degree, year, college },
            id
          );
          newQualifications.push(parseInt(id));
        } else {
          let qualification = await qualificationService.addQualification({
            doctor_id,
            degree,
            year,
            college,
          });
          console.log("QUALIFICATIONS ITEMMMMMMMMMMMMMMMM", qualification);
        }
      }

      console.log("QUALIFICATIONS NEWWWWWWWWWWWW", newQualifications);

      for (let qualification of qualificationsOfDoctor) {
        let qId = qualification.get("id");
        if (newQualifications.includes(qId)) {
          console.log("QUALIFICATIONS IFFFF", newQualifications);
          continue;
        } else {
          console.log("QUALIFICATIONS ELSEEEE", newQualifications);
          let deleteDocs = await documentService.deleteDocumentsOfQualification(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            qId
          );
          let quali = await qualificationService.getQualificationById(qId);
          quali.destroy();
        }
      }
      let updatedUser = await userService.updateUser(
        user_data_to_update,
        user_id
      );
      return this.raiseSuccess(
        res,
        200,
        {
          // doctor
        },
        "qualifications updated successfully"
      );
    } catch (error) {
      console.log("DOCTOR QUALIFICATION CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  getDoctorQualificationRegisterData = async (req, res) => {
    let { userId } = req.params;
    try {
      const qualificationData = await doctorQualificationData(userId);
      console.log("FINAL+++================>", qualificationData);

      return this.raiseSuccess(
        res,
        200,
        {
          qualificationData,
        },
        " get doctor qualification successfull"
      );
    } catch (error) {
      console.log("DOCTOR QUALIFICATION REGISTER CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  uploadDoctorQualificationDocument = async (req, res) => {
    console.log("FILEEEEEEEEEEEEEEEE=================>", req.file);

    const file = req.file;
    const { userId = 1 } = req.params;
    let { qualification = {} } = req.body;
    console.log(
      "BODYYYYYYYYYYYYYYYY=================>",
      qualification,
      typeof qualification
    );
    try {
      let files = await uploadImageS3(userId, file);
      let qualification_id = 0;
      let doctor = await doctorService.getDoctorByUserId(userId);
      let doctor_id = doctor.get("id");
      // let{ degree = '', year = '', college = '' } =JSON.parse(qualification);
      // console.log('BODYYYYYYYYYYYYYYYY1111111=================>', degree, year, college);
      // let qualificationOfDoctor = await qualificationService.getQualificationByData(doctor_id,degree,year,college);
      // console.log(' QUALIFICATIONNNN OF DOCTORRRR',qualificationOfDoctor);
      // // let qualificationOfDoctorExist=qualificationOfDoctor?qualificationOfDoctor.length:false;
      // if (!qualification_id && !qualificationOfDoctor) {
      //   let docQualification = await qualificationService.addQualification({ doctor_id, degree, year, college });
      //  console.log('DOCTORRRR QUALIFICATIONNNN',docQualification);
      //   qualification_id = docQualification.get('id');
      //   let document = await documentService.addDocument({ parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION, parent_id: qualification_id, document: files[0] });
      // } else if(!qualification_id) {
      //   qualification_id = qualificationOfDoctor.get('id');
      //   let document = await documentService.addDocument({ parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION, parent_id: qualification_id, document: files[0] });
      // }else{
      // qualification_id=qualificationId;
      // let document = await documentService.addDocument({ parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION, parent_id: qualification_id, document: files[0] });
      // }
      return this.raiseSuccess(
        res,
        200,
        {
          files: files,
          qualification_id,
        },
        "doctor qualification updated successfully"
      );
    } catch (error) {
      console.log("doctor qualification upload CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  deleteDoctorQualificationDocument = async (req, res) => {
    const { qualificationId = 1 } = req.params;
    let { document = "" } = req.body;
    try {
      console.log("DOCUMNENTTTTTTTTTT", req.body, document);
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION;
      let parent_id = qualificationId;
      let documentToDelete = await documentService.getDocumentByData(
        parent_type,
        parent_id,
        document
      );

      console.log(
        "DOCUMNENTTTTTTTTTT1111111",
        req.body,
        document,
        documentToDelete
      );
      await documentToDelete.destroy();
      return this.raiseSuccess(
        res,
        200,
        {},
        "doctor qualification doc deleted successfully"
      );
    } catch (error) {
      console.log("doctor qualification upload CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  registerQualification = async (req, res) => {
    let { gender = "", speciality = "", qualification = {} } = req.body;
    const { userId = 1 } = req.params;
    try {
      console.log("REGISTER QUALIFICATIONNNNNNNNN", qualification);

      let user = userService.getUserById(userId);
      let doctor = await doctorService.getDoctorByUserId(userId);
      let doctor_id = doctor.get("id");

      if (gender && speciality) {
        let doctor_data = { gender, speciality };
        let updatedDoctor = await doctorService.updateDoctor(
          doctor_data,
          doctor_id
        );
      }
      let { degree = "", year = "", college = "", id = 0, photos = [] } =
        qualification || {};
      let qualification_id = id;
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION;
      let parent_id = qualification_id;
      // console.log("REGISTER QUALIFICATIONNNNNNNNN1111111", id,qualification_id);
      if (!qualification_id) {
        let docQualification = await qualificationService.addQualification({
          doctor_id,
          degree,
          year,
          college,
        });
        qualification_id = docQualification.get("id");

        for (let photo of photos) {
          let document = photo;
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            document
          );

          // console.log("DOCUMENT EXISTTTTTTTTTTTT", id,qualification_id,docExist);
          if (!docExist) {
            let qualificationDoc = await documentService.addDocument({
              doctor_id,
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
              parent_id: qualification_id,
              document: photo,
            });
          }
        }
      } else {
        for (let photo of photos) {
          let document = photo;
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            document
          );

          console.log(
            "DOCUMENT EXISTTTTTTTTTTTT",
            id,
            qualification_id,
            docExist
          );
          if (!docExist) {
            let qualificationDoc = await documentService.addDocument({
              doctor_id,
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
              parent_id: qualification_id,
              document: photo,
            });
          }
          // let qualificationDoc = await documentService.addDocument({ doctor_id, parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION, parent_id: qualification_id, document: photo })
        }
      }

      // console.log("QUALIFICATIONNNNNNNNN IDDDDDDDD", qualification_id);
      return this.raiseSuccess(
        res,
        200,
        {
          qualification_id,
        },
        "qualifications updated successfully"
      );
    } catch (error) {
      console.log("DOCTOR QUALIFICATION CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  doctorClinicRegister = async (req, res) => {
    let { clinics = [] } = req.body;

    const { userId: user_id } = req.params;
    try {
      // let user= await userService.getUserById(user_id);
      let doctor = await doctorService.getDoctorByUserId(user_id);
      let doctor_id = doctor.get("id");

      console.log(
        "DOCTORRRR UUSER",
        doctor_id,
        "    HDJDH 9088      ",
        "    DEJIDJ*(*)    ",
        doctor
      );

      clinics.forEach(async (item) => {
        let { name = "", location = "", startTime = "", endTime = "" } = item;
        let start_time = moment(startTime);
        let end_time = moment(endTime);
        console.log(
          "ITEMMMMMMMMMM OF CKININIC",
          name,
          location,
          startTime,
          endTime,
          start_time,
          end_time,
          doctor_id
        );
        let clinic = await clinicService.addClinic({
          doctor_id,
          name,
          location,
          start_time,
          end_time,
        });
      });

      let updateUser = await userService.updateUser(
        {
          onboarded: true,
          onboarding_status: ONBOARDING_STATUS.CLINIC_REGISTERED,
        },
        user_id
      );

      return this.raiseSuccess(res, 200, {}, "clinics added successfully");
    } catch (error) {
      console.log("DOCTOR QUALIFICATION CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };
}

export default new UserController();
