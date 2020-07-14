import DoctorQualificationWrapper from "../../ApiWrapper/web/doctorQualification";

const { OAuth2Client } = require("google-auth-library");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const request = require("request");
const chalk = require("chalk");
import bcrypt from "bcrypt";

import Log from "../../../libs/log";
import fs from "fs";
const Response = require("../helper/responseFormat");
import userService from "../../services/user/user.service";
// import doctorService from "../../services/doctor/doctor.service";
import patientService from "../../services/patients/patients.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import treatmentService from "../../services/treatment/treatment.service";
import severityService from "../../services/severity/severity.service";
import conditionService from "../../services/condition/condition.service";

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import DoctorRegistrationWrapper from "../../ApiWrapper/web/doctorRegistration";
import TreatmentWrapper from "../../ApiWrapper/web/treatments";
import SeverityWrapper from "../../ApiWrapper/web/severity";
import ConditionWrapper from "../../ApiWrapper/web/conditions";

import doctorService from "../../services/doctors/doctors.service";
// import patientService from "../../services/patients/patients.service";
import qualificationService from "../../services/doctorQualifications/doctorQualification.service";
import clinicService from "../../services/doctorClinics/doctorClinics.service";
import documentService from "../../services/uploadDocuments/uploadDocuments.service";
import registrationService from "../../services/doctorRegistration/doctorRegistration.service";
import carePlanTemplateService from "../../services/carePlanTemplate/carePlanTemplate.service";
// import userWrapper from "../../ApiWrapper/web/user";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";
import Controller from "../";
import { doctorQualificationData, uploadImageS3 } from "./userHelper";
import { v4 as uuidv4 } from "uuid";
import constants from "../../../config/constants";
import {
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  DOCUMENT_PARENT_TYPE,
  ONBOARDING_STATUS, VERIFICATION_TYPE
} from "../../../constant";
import { Proxy_Sdk, EVENTS } from "../../proxySdk";
// import  EVENTS from "../../proxySdk/proxyEvents";
const errMessage = require("../../../config/messages.json").errMessages;
import minioService from "../../../app/services/minio/minio.service";
import md5 from "js-md5";
import UserVerifications from "../../models/userVerifications";
import UploadDocumentWrapper from "../../ApiWrapper/web/uploadDocument";
import uploadDocumentService from "../../services/uploadDocuments/uploadDocuments.service";

import { getCarePlanAppointmentIds, getCarePlanMedicationIds, getCarePlanSeverityDetails } from '../carePlans/carePlanHelper';
import LinkVerificationWrapper from "../../ApiWrapper/mobile/userVerification";
const Logger = new Log("WEB USER CONTROLLER");

class UserController extends Controller {
  constructor() {
    super();
  }

  async signUp(req, res) {

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
      const status = "pending";
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);

      let user = await userService.addUser({
        email,
        password: hash,
        sign_in_type: "basic",
        category: "doctor",
        onboarded: false
      });

      const userInfo = await userService.getUserByEmail({ email });

      const userVerification = UserVerificationServices.addRequest({
        user_id: userInfo.get("id"),
        request_id: link,
        status: "pending",
        type: VERIFICATION_TYPE.SIGN_UP
      });
      let uId = userInfo.get("id");

      console.log(
        "CREDENTIALSSSSSSSSSSSSSS111111111111",
        "      1234567890          ",
        userInfo.get("id"),
        process.config.app.invite_link + link
      );
      const emailPayload = {
        title: "Verification mail",
        toAddress: email,
        templateName: EMAIL_TEMPLATE_NAME.WELCOME,
        templateData: {
          title: "Doctor",
          link: process.config.WEB_URL + process.config.app.invite_link + link,
          inviteCard: "",
          mainBodyText: "We are really happy that you chose us.",
          subBodyText: "Please verify your account",
          buttonText: "Verify",
          host: process.config.WEB_URL,
          contactTo: "patientEngagement@adhere.com"
        }
      };

      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

      response = new Response(true, 200);
      response.setMessage("Sign Up Successfully!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("signup err,", err);
      if (err.code && err.code == 11000) {
        let response = new Response(false, 400);
        response.setError(errMessage.EMAIL_ALREADY_EXISTS);
        return res.status(400).json(response.getResponse());
      } else {
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
      }
    }
  }

  verifyUser = async (req, res) => {
    try {
      console.log("IN VERIFY USERRRRRRRR");
      let { link } = req.params;
      console.log("IN VERIFY USERRRRRRRR", link);
      let verifications = await UserVerificationServices.getRequestByLink(link);
      let userId = verifications.get("user_id");
      let userData = await userService.getUserById(userId);
      let isVerified = userData.get('verified');
      console.log('IS VERIFIEDDDDDD ===========>', isVerified);
      if (!isVerified) {
        let updateVerification = await UserVerificationServices.updateVerification(
          { status: "verified" },
          link
        );

        // let activated_on = moment();
        let verified = true;
        let dataToUpdate = { verified };
        console.log("DATA TO UPDATEEEE", dataToUpdate);
        let user = await userService.updateUser(dataToUpdate, userId);


        console.log("UPDATED USERRRRR", user);
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;

        const accessToken = await jwt.sign(
          {
            userId,
          },
          secret,
          {
            expiresIn,
          }
        );


        const apiUserDetails = await UserWrapper(userData.getBasicInfo);

        const dataToSend = {
          users: {
            [apiUserDetails.getUserId()]: {
              ...apiUserDetails.getBasicInfo()
            }
          },
          auth_user: apiUserDetails.getUserId(),
          auth_category: apiUserDetails.getCategory()
        };


        // res.redirect("/sign-in");
        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true,
        });

        console.log(
          " Verify User --------------->  ",
          link,
          " 6uuu ",
          userId,
          " 90990",
          user,
          "            ",
          updateVerification,
          verifications
        );



        return this.raiseSuccess(
          res,
          200,
          { ...dataToSend },
          "user verified successfully"
        );
      } else {

        res.redirect("/sign-in");
        return this.raiseServerError(res, 422, error, error.message);
      }
    } catch (error) {
      console.log("error sign in  --> ", error);
      res.redirect("/sign-in");
      return this.raiseServerError(res, 500, error, error.message);
    }
  };


  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail({
        email
      });

      // console.log("MOMENT===========>", user.getBasicInfo);
      // const userDetails = user[0];
      // console.log("userDetails --> ", userDetails);
      if (!user) {
        return this.raiseClientError(res, 422, user, "user does not exists");
      }

      // let verified = user.get("verified");
      //
      // if (!verified) {
      //   return this.raiseClientError(res, 401, "user account not verified");
      // }

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
            userId: user.get("id")
          },
          secret,
          {
            expiresIn
          }
        );

        const apiUserDetails = await UserWrapper(user.get());

        console.log('ID OF USERRRRRRRR,', apiUserDetails);

        let permissions = {
          permissions: []
        };

        if (apiUserDetails.isActivated()) {
          permissions = await apiUserDetails.getPermissions();
        }

        const dataToSend = {
          users: {
            [apiUserDetails.getId()]: apiUserDetails.getBasicInfo(),
          },
          ...permissions,
          auth_user: apiUserDetails.getId(),
          auth_category: apiUserDetails.getCategory()
        };

        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true
        });

        return this.raiseSuccess(
          res,
          200,
          { ...dataToSend },
          "initial data retrieved successfully"
        );
      } else {
        return this.raiseClientError(res, 422, {}, "Password not matching");
      }
    } catch (error) {
      console.log("error sign in  --> ", error);
      return this.raiseServerError(res, 500, error, error.message);
    }
  };

  async signInGoogle(req, res) {
    const authCode = req.body.tokenId;
    const CLIENT_ID = process.config.GOOGLE_KEYS.CLIENT_ID;
    const CLIENT_SECRET = process.config.GOOGLE_KEYS.CLIENT_SECRET;
    const REDIRECT_URI = process.config.GOOGLE_KEYS.REDIRECT_URI;
    try {
      const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

      const tokens = await client.getToken(authCode);

      const idToken = tokens.tokens.id_token;
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID
      });

      const accessToken = tokens.tokens.access_token;
      console.log("acess token ==== ", accessToken);

      const payload = ticket.getPayload();
      // console.log(payload);

      // create user in Db  if does not exist

      // create jwt token for cookie
      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 1 day
      const secret = process.config.TOKEN_SECRET_KEY;
      const userId = 3;
      const accessTokenCombined = await jwt.sign(
        {
          userId: userId,
          accessToken: accessToken
        },
        secret,
        {
          expiresIn
        }
      );

      console.log("access token combines --> ", accessTokenCombined);

      res.cookie("accessToken", accessTokenCombined, {
        // expires: new Date(
        //     Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        // ),
        httpOnly: true
      });

      let response = new Response(true, 200);
      response.setMessage("Sign in successful!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("error ======== ", err);
      //throw err;
      let response = new Response(false, 500);
      response.setMessage("Sign in Unsuccessful!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    }
  }

  async signInFacebook(req, res) {
    const { accessToken } = req.body;
    console.log("111--> ", accessToken);
    try {
      request(
        `https://graph.facebook.com/v2.3/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.config.FACEBOOK_KEYS.APP_TOKEN}&client_secret=${process.config.FACEBOOK_KEYS.SECRET_TOKEN}&fb_exchange_token=${accessToken}`,
        { json: true },
        async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          const { access_token = "", expires_in } = body || {};

          const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 1 day
          const secret = process.config.TOKEN_SECRET_KEY;
          const userId = "4"; // todo: seeder for facebook sign-in doctor

          if (access_token) {
            const accessTokenCombined = await jwt.sign(
              {
                userId: userId,
                accessToken: accessToken
              },
              secret,
              {
                expiresIn
              }
            );

            res.cookie("accessToken", accessTokenCombined, {
              // expires: new Date(
              //     Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
              // ),
              httpOnly: true
            });

            let resp = new Response(true, 200);
            resp.setData({
              users: {}
            });
            resp.setMessage("Sign in successful!");
            return res.status(resp.getStatusCode()).send(resp.getResponse());
          }
        }
      );

      // let response = new Response(true, 200);
      // response.setMessage("Sign in successful!");
      // return res
      //     .status(response.getStatusCode())
      //     .send(response.getResponse());
    } catch (err) {
      console.log("", err);
      throw err;
    }
  }

  onAppStart = async (req, res, next) => {
    let response;
    try {
      if (req.userDetails.exists) {
        const {
          userId,
          userData,
          userData: { category } = {}
        } = req.userDetails;
        // const user = await userService.getUserById(userId);

        // Logger.debug("user data in request", userData);

        // const userDetails = user[0];

        // const apiUserDetails = await UserWrapper(userData);

        let userCategoryData = {};
        let carePlanApiData = {};
        let userApiData = {};
        let userCaregoryApiData = {};

        let userCategoryApiWrapper = null;
        let userCategoryId = null;
        let patientIds = [];
        let userIds = [userId];
        let careplanData = [];

        console.log("GET USER CATEGORY DATA", category, userId);
        switch (category) {
          case USER_CATEGORY.PATIENT:
            userCategoryData = await patientService.getPatientByUserId(userId);
            break;
          case USER_CATEGORY.DOCTOR:
            userCategoryData = await doctorService.getDoctorByUserId(userId);
            if (userCategoryData) {
              userCategoryApiWrapper = await DoctorWrapper(userCategoryData);

              userCategoryId = userCategoryApiWrapper.getDoctorId();
              userCaregoryApiData[
                userCategoryApiWrapper.getDoctorId()
              ] = userCategoryApiWrapper.getBasicInfo();

              careplanData = await carePlanService.getCarePlanByData({
                doctor_id: userCategoryId
              });

              await careplanData.forEach(async carePlan => {
                const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                patientIds.push(carePlanApiWrapper.getPatientId());
                const carePlanId = carePlanApiWrapper.getCarePlanId();
                let carePlanSeverityDetails = await getCarePlanSeverityDetails(carePlanId);

                carePlanApiData[
                  carePlanApiWrapper.getCarePlanId()
                ] =
                  // carePlanApiWrapper.getBasicInfo();
                  { ...carePlanApiWrapper.getBasicInfo(), ...carePlanSeverityDetails };
              });
            }
            break;
          default:
            userCategoryData = await doctorService.getDoctorByData({
              user_id: userId
            });
        }

        // await careplanData.forEach(async carePlan => {
        //   const carePlanApiWrapper = await CarePlanWrapper(carePlan);
        //   carePlanApiData[carePlanApiWrapper.getCarePlanId()] = carePlanApiWrapper.getBasicInfo();
        // });

        // todo: as of now, get all patients
        console.log("PATIENT IDSSSSSSSSSS========>", patientIds);
        const patientsData = await patientService.getPatientByData({
          id: patientIds
        });

        let patientApiDetails = {};

        if (patientsData) {
          await patientsData.forEach(async patient => {
            const patientWrapper = await PatientWrapper(patient);
            patientApiDetails[
              patientWrapper.getPatientId()
            ] = patientWrapper.getBasicInfo();
            userIds.push(patientWrapper.getUserId());
          });
        }
        // Logger.debug("userIds --> ", userIds);

        let apiUserDetails = {};

        if (userIds.length > 1) {
          const allUserData = await userService.getUserByData({ id: userIds });
          await allUserData.forEach(async user => {
            apiUserDetails = await UserWrapper(user.get());
            userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();
          });
        } else {
          apiUserDetails = await UserWrapper(userData);
          userApiData[
            apiUserDetails.getUserId()
          ] = apiUserDetails.getBasicInfo();
        }

        // treatments
        let treatmentApiDetails = {};
        let treatmentIds = [];
        const treatmentDetails = await treatmentService.getAll();

        for (const treatment of treatmentDetails) {
          const treatmentWrapper = await TreatmentWrapper(treatment);
          treatmentIds.push(treatmentWrapper.getTreatmentId());
          treatmentApiDetails[treatmentWrapper.getTreatmentId()] = treatmentWrapper.getBasicInfo();
        }

        // severity
        let severityApiDetails = {};
        let severityIds = [];
        const severityDetails = await severityService.getAll();

        for (const severity of severityDetails) {
          const severityWrapper = await SeverityWrapper(severity);
          severityIds.push(severityWrapper.getSeverityId());
          severityApiDetails[severityWrapper.getSeverityId()] = severityWrapper.getBasicInfo();
        }

        // conditions
        let conditionApiDetails = {};
        let conditionIds = [];
        const conditionDetails = await conditionService.getAll();

        for (const condition of conditionDetails) {
          const conditionWrapper = await ConditionWrapper(condition);
          conditionIds.push(conditionWrapper.getConditionId());
          conditionApiDetails[conditionWrapper.getConditionId()] = conditionWrapper.getBasicInfo();
        }

        let permissions = {
          permissions: []
        };

        if (apiUserDetails.isActivated()) {
          permissions = await apiUserDetails.getPermissions();
        }

        /**** API wrapper for DOCTOR ****/

        const dataToSend = {
          users: {
            ...userApiData
          },
          [`${category}s`]: {
            ...userCaregoryApiData
          },
          patients: {
            ...patientApiDetails
          },
          care_plans: {
            ...carePlanApiData
          },
          treatments: {
            ...treatmentApiDetails,
          },
          severity: {
            ...severityApiDetails,
          },
          conditions: {
            ...conditionApiDetails,
          },
          ...permissions,
          treatment_ids: treatmentIds,
          severity_ids: severityIds,
          condition_ids: conditionIds,
          auth_user: userId,
          auth_category: category
        };

        return this.raiseSuccess(res, 200, { ...dataToSend }, "basic info");
      } else {
        console.log("userExists --->>> ", req.userDetails.exists);
        // throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      Logger.debug("onAppStart 500 error", err);
      return this.raiseServerError(res);
      // console.log("ON APP START CATCH ERROR ", err);
      // response = new Response(false, 500);
      // response.setError(err.message);
      // return res.status(500).json(response.getResponse());
    }
  };

  signOut = async (req, res) => {
    try {
      if (req.cookies.accessToken) {
        res.clearCookie("accessToken");

        return this.raiseSuccess(res, 200, {}, "Signed out successfully!");
      } else {
        return this.raiseServerError(res, 500, {}, constants.COOKIES_NOT_SET);
        // let response = new Response(false, 500);
        // response.setError(errMessage.INTERNAL_SERVER_ERROR);
        // return res.status(500).json(response.getResponse());
      }
    } catch (error) {
      console.log("SIGN OUT CATCH ERROR ", error);
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

      let files = await uploadImageS3(userId, file);
      return this.raiseSuccess(
        res,
        200,
        {
          files: files
        },
        "files uploaded successfully"
      );
    } catch (error) {
      console.log("FILE UPLOAD CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  doctorProfileRegister = async (req, res) => {
    const { userDetails: { userId: user_id } = {} } = req;
    let { name, city, category, mobile_number, prefix, profile_pic } = req.body;
    let doctorName = name.split(" ");
    // const { userId: user_id } = req.params;

    Logger.debug("POST DOCTOR REGISTER --> ", user_id, req.params, req.body);
    try {
      let user = await userService.getUserById(user_id);
      let user_data_to_update = {
        category,
        mobile_number,
        prefix,
        onboarding_status: ONBOARDING_STATUS.PROFILE_REGISTERED
      };
      console.log("USERRRRRRRR1111111", user_data_to_update);
      console.log("REQUESTTTTTTTT BODYYYYYY", req.body);

      let doctor = {};
      // console.log("USERRRRRRRR", updatedUser);
      let doctorExist = await doctorService.getDoctorByUserId(user_id);
      // console.log('DOCTORRRRR EXISTTT',doctorExist.get('id'),doctorExist.getBasicInfo);

      Logger.debug("POST DOCTOR REGISTER --> ", user_id, doctorExist);

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
          profile_pic: profile_pic ? profile_pic.split(process.config.minio.MINIO_BUCKET_NAME)[1]
            : null,
          first_name,
          middle_name,
          last_name,
          address: city
        };
        let doctor_id = doctorExist.get("id");
        doctor = await doctorService.updateDoctor(doctor_data, doctor_id);
        console.log("DOCTORRRRRIFFFFFF", doctor, doctor.getBasicInfo);
      } else {
        let doctor_data = {
          user_id,
          city,
          profile_pic: profile_pic
            ? profile_pic.split(process.config.minio.MINIO_BUCKET_NAME)[1]
            : null,
          first_name,
          middle_name,
          last_name,
          address: city
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
          doctor
        },
        "doctor profile updated successfully"
      );
    } catch (error) {
      console.log("DOCTOR REGISTER CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  getDoctorProfileRegisterData = async (req, res) => {
    try {
      let name = "";
      let email = "";
      let city = "";
      let category = "";
      let prefix = "";
      let mobile_number = "";
      let profile_pic = "";

      const { userDetails: { userId } = {} } = req || {};

      Logger.debug("userId ---> ", req);

      let user = await userService.getUserById(userId);
      console.log("GET PROFILE DATA USERRRRRRR", user.getBasicInfo);
      let userInfo = user.getBasicInfo;
      const {
        email: eMail = "",
        category: docCategory = "",
        mobile_number: mobNo = "",
        prefix: pre = ""
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
          profile_pic: docPic = ""
        } = docInfo || {};

        Logger.debug("MIDDLE NAME --> ", first_name, middle_name, last_name, name);

        name = `${first_name} ${middle_name ? `${middle_name} ` : ""}${last_name ? `${last_name} ` : ""}`;

        city = docCity;
        profile_pic = docPic ? `${process.config.minio.MINIO_S3_HOST}/${process.config.minio.MINIO_BUCKET_NAME}${docPic}` : null;
      }

      const profileData = {
        name,
        city,
        category,
        mobile_number,
        prefix,
        profile_pic,
        email
      };

      console.log("FINAL+++================>", profileData);

      return this.raiseSuccess(
        res,
        200,
        {
          profileData
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
      qualification_details = [],
      registration_details = []
    } = req.body;

    const { userDetails: { userId: user_id } = {} } = req || {};
    try {
      let user = userService.getUserById(user_id);
      let user_data_to_update = {
        onboarding_status: ONBOARDING_STATUS.QUALIFICATION_REGISTERED
      };
      let doctor = await doctorService.getDoctorByUserId(user_id);
      let doctor_id = doctor.get("id");
      let doctor_data = {
        gender,
        speciality
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
          id = 0
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
            college
          });
          console.log("QUALIFICATIONS ITEMMMMMMMMMMMMMMMM", qualification);
        }
      }

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

      // REGISTRATION FOR DOCTOR
      const registrationsOfDoctor = await registrationService.getRegistrationByDoctorId(doctor_id);

      let newRegistrations = [];
      for (const item of registration_details) {
        const {
          number,
          council,
          year,
          expiry_date,
          id = 0
        } = item;
        console.log("REGISTRATION ITEMMMMMMMMMMMMMMMM", item, id);
        if (id && id !== "0") {
          let registration = await registrationService.updateRegistration(
            { doctor_id, number, year, council, expiry_date },
            id
          );
          newRegistrations.push(parseInt(id));
        } else {
          let registration = await registrationService.addRegistration({
            doctor_id,
            number,
            year,
            council,
            expiry_date
          });
          console.log("REGISTRATION ITEMMMMMMMMMMMMMMMM", registration);
        }
      }

      for (let registration of registrationsOfDoctor) {
        let rId = registration.get("id");
        if (newRegistrations.includes(rId)) {
          console.log("REGISTRATION IFFFF", newRegistrations);
          continue;
        } else {
          console.log("REGISTRATION ELSEEEE", newRegistrations);
          let deleteDocs = await documentService.deleteDocumentsOfQualification(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            rId
          );
          let register = await registrationService.getRegistrationById(rId);
          register.destroy();
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

  getDoctorRegistrationData = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { userDetails: { userId } = {} } = req;

      const doctor = await doctorService.getDoctorByUserId(userId);
      // let doctor_id = doctor.get("id");

      const doctorRegistrationDetails = await registrationService.getRegistrationByDoctorId(doctor.get("id"));

      let doctorRegistrationApiDetails = {};
      let uploadDocumentApiDetails = {};
      let upload_document_ids = [];

      await doctorRegistrationDetails.forEach(async doctorRegistration => {
        const doctorRegistrationWrapper = await DoctorRegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments = await documentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
          doctorRegistrationWrapper.getDoctorRegistrationId()
        );

        await registrationDocuments.forEach(async document => {
          const uploadDocumentWrapper = await UploadDocumentWrapper(document);
          uploadDocumentApiDetails[
            uploadDocumentWrapper.getUploadDocumentId()
          ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        });


        doctorRegistrationApiDetails[
          doctorRegistrationWrapper.getDoctorRegistrationId()
        ] = {
          ...doctorRegistrationWrapper.getBasicInfo(),
          upload_document_ids
        };

        upload_document_ids = [];
      });

      return raiseSuccess(
        res,
        200,
        {
          doctor_registrations: {
            ...doctorRegistrationApiDetails
          },
          upload_documents: {
            ...uploadDocumentApiDetails
          }
        },
        "doctor registration data fetched successfully"
      );


    } catch (error) {
      Logger.debug("GET DOCTOR REGISTRATION DATA 500 ERROR ---->", error);
      return raiseServerError(res);
    }
  };

  getDoctorQualificationRegisterData = async (req, res) => {
    const { userDetails: { userId } = {} } = req || {};
    try {
      const qualificationData = await doctorQualificationData(userId);
      console.log("FINAL+++================>", qualificationData);

      const doctor = await doctorService.getDoctorByUserId(userId);
      // let doctor_id = doctor.get("id");

      const doctorRegistrationDetails = await registrationService.getRegistrationByDoctorId(doctor.get("id"));

      // Logger.debug("283462843 ", doctorRegistrationDetails);

      let doctorRegistrationApiDetails = {};
      let uploadDocumentApiDetails = {};
      let upload_document_ids = [];

      for (let doctorRegistration of doctorRegistrationDetails) {
        const doctorRegistrationWrapper = await DoctorRegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments = await uploadDocumentService.getDoctorQualificationDocuments(
          DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
          doctorRegistrationWrapper.getDoctorRegistrationId()
        );

        await registrationDocuments.forEach(async document => {
          const uploadDocumentWrapper = await UploadDocumentWrapper(document);
          uploadDocumentApiDetails[
            uploadDocumentWrapper.getUploadDocumentId()
          ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        });

        Logger.debug("76231238368126312 ", doctorRegistrationWrapper.getBasicInfo());
        doctorRegistrationApiDetails[
          doctorRegistrationWrapper.getDoctorRegistrationId()
        ] = {
          ...doctorRegistrationWrapper.getBasicInfo(),
          upload_document_ids
        };

        upload_document_ids = [];
      }

      Logger.debug("doctorRegistrationApiDetails --> ", doctorRegistrationApiDetails);

      return this.raiseSuccess(
        res,
        200,
        {
          qualificationData,
          registration_details: {
            ...doctorRegistrationApiDetails
          },
          upload_documents: {
            ...uploadDocumentApiDetails
          }
        },
        " get doctor qualification successfull"
      );
    } catch (error) {
      console.log("DOCTOR QUALIFICATION REGISTER CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };


  uploadDoctorRegistrationDocuments = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const file = req.file;
      const { userDetails: { userId } = {} } = req;
      let { qualification = {} } = req.body;

      let files = await uploadImageS3(userId, file);

      Logger.debug("files", files);

      return this.raiseSuccess(
        res,
        200,
        {
          files: files
        },
        "doctor qualification updated successfully"
      );
    } catch (error) {
      Logger.debug("uploadDoctorRegistrationDocuments CATCH ERROR ---->", error);
      return raiseServerError(res);
    }
  };

  uploadDoctorQualificationDocument = async (req, res) => {
    console.log("FILEEEEEEEEEEEEEEEE=================>", req.file);

    const file = req.file;
    const { userDetails: { userId } = {} } = req;
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

      Logger.debug("files", files);
      return this.raiseSuccess(
        res,
        200,
        {
          files: files
        },
        "doctor qualification updated successfully"
      );
    } catch (error) {
      console.log("doctor qualification upload CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  deleteDoctorRegistrationDocument = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;

    try {
      const { registrationId = 0 } = req.params;
      const { document = "" } = req.body;
      // const documentToCheck = document.includes(process.config.minio.MINIO_BUCKET_NAME) ? document.split(process.config.minio.MINIO_BUCKET_NAME)[1] : document;
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION;
      let parent_id = registrationId;
      console.log('DELETE REGISTRATION DOCUMENT=======*******>', registrationId, document, parent_type);
      let documentToDelete = await documentService.getDocumentByData(
        parent_type,
        parent_id,
        document.includes(process.config.minio.MINIO_BUCKET_NAME) ? document.split(process.config.minio.MINIO_BUCKET_NAME)[1] : document,
      );
      console.log('DELETE REGISTRATION DOCUMENT=======*******>11111', documentToDelete);

      await documentToDelete.destroy();
      return raiseSuccess(
        res,
        200,
        {},
        "doctor registration document deleted successfully"
      );
    } catch (error) {
      Logger.debug("DOCTOR REGISTRATION DOCUMENT DELETE 500 ERROR ---->", error);
      return raiseServerError(res);
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
        document.includes(process.config.minio.MINIO_BUCKET_NAME) ? document.split(process.config.minio.MINIO_BUCKET_NAME)[1] : document

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

  updateRegistrationDetails = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { body, userDetails: { userId } = {} } = req;
      let { gender = "", speciality = "", qualification_details = [], registration = {} } = body || {};

      let doctor = await doctorService.getDoctorByUserId(userId);
      let doctor_id = doctor.get("id");

      Logger.debug("doctor id ---128371 -> ", doctor_id);

      if (gender && speciality) {
        let doctor_data = { gender, speciality };
        let updatedDoctor = await doctorService.updateDoctor(
          doctor_data,
          doctor_id
        );
      }

      console.log("REGISTRATIONNN DATTAAAAAAAAA000000", doctor_id, gender, speciality);
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
          id = 0
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
            college
          });
          console.log("QUALIFICATIONS ITEMMMMMMMMMMMMMMMM", qualification);
        }
      }

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


      // console.log("REGISTRATIONNN DATTAAAAAAAAA111",register);
      let { number = "", council = "", year: registration_year = "", expiryDate: expiry_date = "", id: registration_id = 0, photos: registration_photos = [] } =
        registration || {};

      console.log("REGISTRATIONNN DATTAAAAAAAAA22222", number, council, registration_year, typeof (registration_id));
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION;
      let parent_id = registration_id;

      if (!registration_id) {
        console.log("IN NOT REGISTRATION IDDDDDDDDD", number, council, registration_year, expiry_date);
        if (registration_photos.length > 3) {
          return this.raiseServerError(res, 422, "cannot add more than 3 images");

        }
        let docRegistration = await registrationService.addRegistration({
          doctor_id,
          number,
          council,
          year: registration_year,
          expiry_date,
        });

        registration_id = docRegistration.get('id');

        console.log("REGISTRATIONNN DATTAAAAAAAAA3333333 CREATEDDD");
        console.log("REGISTRATIONNN DATTAAAAAAAAA3333333", docRegistration);




        for (let photo of registration_photos) {
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo
          );

          if (!docExist) {
            let qualificationDoc = await documentService.addDocument({
              doctor_id,
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              parent_id: docRegistration.get("id"),
              document: photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo,
            });
          }
        }
      } else {

        console.log("IN REGISTRATION IDDDDDDDDD");

        let doctorDocs = await documentService.getDoctorQualificationDocuments(parent_type, parent_id); //registration documents because
        //parent type is registration

        let documentsToAdd = [];



        for (let photo of registration_photos) {
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo
          );


          if (!docExist) {
            documentsToAdd.push(photo);
          }
        }
        console.log("DOCUMENT EXISTTTTTTTTTTTT970===========>", documentsToAdd.length, doctorDocs.length, doctorDocs, documentsToAdd);
        if (documentsToAdd.length > 3) {
          return this.raiseServerError(res, 422, "cannot add more than 3 images");
        }

        if (doctorDocs.length + documentsToAdd.length > 3) {

          return this.raiseServerError(res, 422, "cannot add more than 3 images");

        }
        for (let photo of documentsToAdd) {
          let document = photo;
          let registrationDoc = await documentService.addDocument({
            doctor_id,
            parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            parent_id: registration_id,
            document: photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo,
            // .includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo,
          });
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          registration_id
        },
        "registrations updated successfully"
      );

    } catch (error) {
      console.log("add registration error", error);
      return raiseServerError(res);
    }
  };


  registerQualification = async (req, res) => {
    let { gender = "", speciality = "", qualification = {} } = req.body;
    const { userDetails: { userId } = {} } = req;
    try {
      // console.log("REGISTER QUALIFICATIONNNNNNNNN", qualification);

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

        if (photos.length > 3) {
          return this.raiseServerError(res, 422, "cannot add more than 3 images");

        }

        let docQualification = await qualificationService.addQualification({ doctor_id, degree, year, college });
        qualification_id = docQualification.get('id');



        console.log("DOCUMENT EXISTTTTTTTTTTTT936===========>", photos.length);



        for (let photo of photos) {
          let document = photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo;
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            document
          );

          if (!docExist) {
            let qualificationDoc = await documentService.addDocument({
              doctor_id,
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
              parent_id: qualification_id,
              document: photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo,
            });
          }
        }
      } else {

        let doctorDocs = await documentService.getDoctorQualificationDocuments(parent_type, parent_id);

        let documentsToAdd = [];



        for (let photo of photos) {
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo
          );


          if (!docExist) {
            documentsToAdd.push(photo);
          }
        }
        console.log("DOCUMENT EXISTTTTTTTTTTTT970===========>", documentsToAdd.length, doctorDocs.length, doctorDocs, documentsToAdd);
        if (documentsToAdd.length > 3) {
          return this.raiseServerError(res, 422, "cannot add more than 3 images");
        }

        if (doctorDocs.length + documentsToAdd.length > 3) {

          return this.raiseServerError(res, 422, "cannot add more than 3 images");

        }
        for (let photo of documentsToAdd) {
          // let document = photo;
          // let docExist = await documentService.getDocumentByData(
          //   parent_type,
          //   parent_id,
          //   document
          // );


          // if (!docExist) {
          let qualificationDoc = await documentService.addDocument({
            doctor_id,
            parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            parent_id: qualification_id,
            document: photo.includes(process.config.minio.MINIO_BUCKET_NAME) ? photo.split(process.config.minio.MINIO_BUCKET_NAME)[1] : photo,
          });
          // }
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

  getClinicTimeSlots = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      return raiseSuccess(
        res,
        200,
        {
          time_slots: {
            ...CLINIC_TIME_SLOTS
          }
        },
        "clinic time slots fetched successfully"
      )
    } catch (error) {
      Logger.debug("getTimeSlots 500 error---> ", error);
      return raiseServerError(res);
    }
  };

  doctorClinicRegister = async (req, res) => {
    let { clinics = [] } = req.body;

    const { userDetails: { userId: user_id } = {} } = req;
    try {
      // let user= await userService.getUserById(user_id);
      let doctor = await doctorService.getDoctorByUserId(user_id);
      let doctor_id = doctor.get("id");

      // console.log('DOCTORRRR UUSER', doctor_id, '    HDJDH 9088      ', '    DEJIDJ*(*)    ', doctor);

      clinics.forEach(async item => {
        let newItem = item;
        let { name = "", location = "", time_slots = [] } = item;

        const details = {
          time_slots
        }

        let clinic = await clinicService.addClinic({
          doctor_id,
          name,
          location,
          details
        });
      });

      let updateUser = await userService.updateUser(
        {
          onboarded: true,
          onboarding_status: ONBOARDING_STATUS.CLINIC_REGISTERED
        },
        user_id
      );

      return this.raiseSuccess(res, 200, {}, "clinics added successfully");
    } catch (error) {
      console.log("DOCTOR QUALIFICATION CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };
  addDoctorsPatient = async (req, res) => {
    const { mobile_number = '', name = '', gender = '', date_of_birth = '', treatment: type = '', severity = '', condition = '', prefix = '', treatment_id = "1", severity_id = "1", condition_id = "1" } = req.body;
    // const{userId:user_id=1}=req.params;
    const { userDetails: { userId: user_id } = {} } = req;
    try {

      let password = process.config.DEFAULT_PASSWORD;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));

      Logger.debug("89312793812 ---> ", password, salt);
      const hash = await bcrypt.hash(password, salt);
      let user = await userService.addUser({
        prefix,
        mobile_number,
        password: hash,
        sign_in_type: "basic",
        category: "patient",
        onboarded: false,
      });

      let newUId = user.get('id');

      let patientName = name.split(" ");
      let first_name = patientName[0];
      let middle_name = patientName.length == 3 ? patientName[1] : "";
      let last_name =
        patientName.length == 3
          ? patientName[2]
          : patientName.length == 2
            ? patientName[1]
            : "";

      let uid = uuidv4();
      let birth_date = moment(date_of_birth);
      let age = moment().diff(birth_date, 'years');
      let patient = await patientService.addPatient({ first_name, gender, middle_name, last_name, user_id: newUId, birth_date, age, uid });

      let doctor = await doctorService.getDoctorByUserId(user_id);
      let carePlanTemplate = await carePlanTemplateService.getCarePlanTemplateByData(treatment_id, severity_id, condition_id);
      const patient_id = patient.get('id');
      const doctor_id = doctor.get('id');

      Logger.debug("9872683794 ------------->", doctor, doctor.get("id"), doctor_id);
      const care_plan_template_id = carePlanTemplate ? carePlanTemplate.get('id') : null;

      const details = care_plan_template_id ? {} : { treatment_id, severity_id, condition_id };
      const carePlan = await carePlanService.addCarePlan({ patient_id, doctor_id, care_plan_template_id, details, expired_on: moment() });

      let carePlanNew = await carePlanService.getSingleCarePlanByData({ patient_id, doctor_id, care_plan_template_id, details });
      const carePlanId = carePlanNew.get('id');


      return this.raiseSuccess(res, 200, { patient_id, carePlanId, carePlanTemplateId: care_plan_template_id }, "doctor's patient added successfully");
    } catch (error) {
      console.log("ADD DOCTOR PATIENT ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  }

  forgotPassword = async (req, res) => {
    const { raiseServerError } = this;
    try {
      const { raiseClientError, raiseSuccess } = this;
      const { email } = req.body;
      const userExists = await userService.getUserByEmail({
        email
      });

      if (userExists) {
        const userWrapper = await UserWrapper(userExists.get());
        const link = uuidv4();

        const userVerification = UserVerificationServices.addRequest({
          user_id: userWrapper.getId(),
          request_id: link,
          status: "pending",
          type: VERIFICATION_TYPE.FORGOT_PASSWORD
        });

        Logger.debug("process.config.WEB_URL --------------->", process.config.WEB_URL);

        const emailPayload = {
          toAddress: email,
          title: "Adhere Reset Password",
          templateData: {
            email,
            link: process.config.app.reset_password + link,
            host: process.config.WEB_URL,
            title: "Doctor",
            inviteCard: "",
            mainBodyText: "Thank you for requesting password reset",
            subBodyText: "Please click below to reset your account password",
            buttonText: "Reset Password",
            contactTo: "patientEngagement@adhere.com"
          },
          templateName: EMAIL_TEMPLATE_NAME.FORGOT_PASSWORD
        };

        console.log("91397138923 emailPayload -------------->", emailPayload);
        const emailResponse = await Proxy_Sdk.execute(
          EVENTS.SEND_EMAIL,
          emailPayload
        );
      } else {
        return raiseClientError(res, 422, {}, "User does not exists for the email");
      }

      raiseSuccess(
        res,
        200,
        {},
        "Thanks! If there is an account associated with the email, we will send the password reset link to it"
      );
    } catch (error) {
      Logger.debug("forgot password 500 error", error);
      return raiseServerError(res);
    }
  }

  verifyPasswordResetLink = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { params: { link } = {} } = req;

      const passwordResetLink = await UserVerificationServices.getRequestByLink(link);

      if (passwordResetLink) {
        const linkVerificationData = await LinkVerificationWrapper(passwordResetLink);

        const userData = await UserWrapper(null, linkVerificationData.getUserId());
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userId: linkVerificationData.getUserId()
          },
          secret,
          {
            expiresIn
          }
        );

        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true
        });

        return raiseSuccess(res, 200, {
          users: {
            [userData.getId()]: {
              ...userData.getBasicInfo()
            }
          }
        }, "Email verified for password reset");
      } else {
        return raiseClientError(res, 422, {}, "Cannot verify email to update password");
      }
    } catch (error) {
      Logger.debug("updateUserPassword 500 error", error);
      return raiseServerError(res);
    }
  };

  updateUserPassword = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { userDetails: { userId }, body: { new_password, confirm_password } = {} } = req;

      const user = await userService.getUserById(userId);
      Logger.debug("user -------------->", user);
      const userData = await UserWrapper(user.get());

      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(new_password, salt);

      const updateUser = await userService.updateUser({
        password: hash
      }, userId);

      const updatedUser = await UserWrapper(null, userId);

      return raiseSuccess(res, 200, {
        users: {
          [updatedUser.getId()]: updatedUser.getBasicInfo()
        },
      },
        "Password reset successful. Please login to continue"
      );

    } catch (error) {
      Logger.debug("updateUserPassword 500 error", error);
      return raiseServerError(res);
    }
  };

}

export default new UserController();
