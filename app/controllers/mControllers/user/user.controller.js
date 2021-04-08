import * as constants from "../../../../config/constants";
import Controller from "../../";
const moment = require("moment");
const jwt = require("jsonwebtoken");
const request = require("request");
import bcrypt from "bcrypt";
import base64 from "js-base64";

import Log from "../../../../libs/log";

const Response = require("../../helper/responseFormat");

import MPatientWrapper from "../../../ApiWrapper/mobile/patient";
import MUserWrapper from "../../../ApiWrapper/mobile/user";
import MDoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import MCarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import LinkVerificationWrapper from "../../../ApiWrapper/mobile/userVerification";
import DoctorProviderMappingWrapper from "../../../ApiWrapper/web/doctorProviderMapping";
import ProvidersWrapper from "../../../ApiWrapper/web/provider";

import userService from "../../../services/user/user.service";
import patientService from "../../../services/patients/patients.service";
import carePlanService from "../../../services/carePlan/carePlan.service";
import doctorService from "../../../services/doctors/doctors.service";
import UserVerificationServices from "../../../services/userVerifications/userVerifications.services";
import otpVerificationService from "../../../services/otpVerification/otpVerification.service";
import doctorProviderMappingService from "../../../services/doctorProviderMapping/doctorProviderMapping.service";
import userRolesService from '../../../services/userRoles/userRoles.service';

import { getServerSpecificConstants } from "./userHelper";
import { v4 as uuidv4 } from "uuid";
import {
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  VERIFICATION_TYPE
} from "../../../../constant";
import { Proxy_Sdk, EVENTS } from "../../../proxySdk";
const errMessage = require("../../../../config/messages.json").errMessages;
import treatmentService from "../../../services/treatment/treatment.service";
import MTreatmentWrapper from "../../../ApiWrapper/mobile/treatments";
import severityService from "../../../services/severity/severity.service";
import MSeverityWrapper from "../../../ApiWrapper/mobile/severity";
import conditionService from "../../../services/condition/condition.service";
import MConditionWrapper from "../../../ApiWrapper/mobile/conditions";
import UserWrapper from "../../../ApiWrapper/web/user";
import UserRolesWrapper from "../../../ApiWrapper/mobile/userRoles";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";

import generateOTP from "../../../helper/generateOtp";
import AppNotification from "../../../NotificationSdk/inApp";
import AdhocJob from "../../../JobSdk/Adhoc/observer";

const Logger = new Log("MOBILE USER CONTROLLER");

class MobileUserController extends Controller {
  constructor() {
    super();
  }

  signIn = async (req, res) => {
    try {
      const { prefix, mobile_number } = req.body;
      const user = await userService.getUserByNumber({ mobile_number, prefix });

      // const userDetails = user[0];
      // console.log("userDetails --> ", userDetails);
      if (!user) {
        return this.raiseClientError(
          res,
          422,
          user,
          "Mobile Number doesn't exists"
        );
      }

      // TODO: UNCOMMENT below code after signup done for password check or seeder
      // const passwordMatch = await bcrypt.compare(
      //   password,
      //   user.get("password")
      // );
      // if (passwordMatch) {
      //   const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day
      //
      //   const secret = process.config.TOKEN_SECRET_KEY;
      //   const accessToken = await jwt.sign(
      //     {
      //       userId: user.get("id")
      //     },
      //     secret,
      //     {
      //       expiresIn
      //     }
      //   );
      const apiUserDetails = await MUserWrapper(user.get());
      const otp = generateOTP();

      // delete previous generated otp if generated within time limit
      const previousOtp = await otpVerificationService.delete({
        user_id: apiUserDetails.getId()
      });

      const patientOtpVerification = await otpVerificationService.create({
        user_id: apiUserDetails.getId(),
        otp
      });

      if(process.config.app.env === "development") {
        const emailPayload = {
          title: "OTP Verification for patient",
          toAddress: process.config.app.developer_email,
          templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
          templateData: {
            title: "Patient",
            mainBodyText: "OTP for adhere patient login is",
            subBodyText: otp,
            host: process.config.WEB_URL,
            contactTo: process.config.app.support_email
          }
        };
        Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
        Logger.info(`OTP :::: ${otp}`);
      } else {

        if(apiUserDetails.getEmail()) {
          const emailPayload = {
            title: "OTP Verification for patient",
            toAddress: apiUserDetails.getEmail(),
            templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
            templateData: {
              title: "Patient",
              mainBodyText: "OTP for adhere patient login is",
              subBodyText: otp,
              host: process.config.WEB_URL,
              contactTo: process.config.app.support_email
            }
          };
          Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
        }

        const smsPayload = {
          // countryCode: prefix,
          phoneNumber: `+${apiUserDetails.getPrefix()}${mobile_number}`, // mobile_number
          message: `Hello from Adhere! Your OTP for login is ${otp}`
        };

        Proxy_Sdk.execute(EVENTS.SEND_SMS, smsPayload);
      }

      // const emailPayload = {
      //   title: "OTP Verification for patient",
      //   toAddress: process.config.app.developer_email,
      //   templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
      //   templateData: {
      //     title: "Patient",
      //     mainBodyText: "OTP for adhere patient login is",
      //     subBodyText: otp,
      //     host: process.config.WEB_URL,
      //     contactTo: process.config.app.support_email
      //   }
      // };
      // Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

      // let permissions = {
      //   permissions: []
      // };
      //
      // if(apiUserDetails.isActivated()) {
      //   permissions = await apiUserDetails.getPermissions();
      // }
      //
      // Logger.debug("apiUserDetails ----> ", apiUserDetails.isActivated());

      return this.raiseSuccess(
        res,
        200,
        {
          user_id: apiUserDetails.getId()
        },
        "OTP sent successfully"
      );
      // } else {
      //   return this.raiseClientError(res, 422, {}, "Invalid Credentials");
      // }
    } catch (error) {
      console.log("error sign in  --> ", error);

       // notification
       const crashJob = await AdhocJob.execute("crash", {apiName: "signIn(patient)"});
       Proxy_Sdk.execute(EVENTS.SEND_EMAIL, crashJob.getEmailTemplate());

      return this.raiseServerError(res);
    }
  };

  verifyOtp = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { otp, user_id } = req.body;

      const otpDetails = await otpVerificationService.getOtpByData({
        otp,
        user_id
      });

      Logger.debug("otpDetails --> ", otpDetails);

      if (otpDetails.length > 0) {
        const destroyOtp = await otpVerificationService.delete({ user_id });
        const userDetails = await userService.getUserById(
          otpDetails[0].get("user_id")
        );

        const userData = await MUserWrapper(userDetails.get());
        let permissions = {
          permissions: []
        };

        if (userData.isActivated()) {
          permissions = await userData.getPermissions();
        }

        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userId: userData.getId()
          },
          secret,
          {
            expiresIn
          }
        );

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(`${user_id}`);
        const feedId = base64.encode(`${user_id}`);

        Logger.debug("userData ----> ", userData.isActivated());
        return raiseSuccess(
          res,
          200,
          {
            accessToken,
            notificationToken,
            feedId,
            users: {
              [userData.getId()]: {
                ...userData.getBasicInfo()
              }
            },
            auth_user: userData.getId(),
            auth_category: userData.getCategory(),
            hasConsent: userData.getConsent(),
            ...permissions
          },
          "Signed in successfully"
        );
      } else {
        return this.raiseClientError(
          res,
          422,
          {},
          "OTP not correct. Please try again"
        );
      }
    } catch (error) {
      Logger.debug("verifyOtp 500 error", error);
      raiseServerError(res);
    }
  };

  doctorSignIn = async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await userService.getUserByEmail({ email });

      // const userDetails = user[0];
      // console.log("userDetails --> ", userDetails);
      if (!user) {
        return this.raiseClientError(res, 422, {}, "Email doesn't exists");
      }

      if(user.get("category") !== USER_CATEGORY.DOCTOR) {
        return this.raiseClientError(res, 422, {}, "Unauthorized");
      }

      // TODO: UNCOMMENT below code after signup done for password check or seeder

      const userRole = await userRolesService.getFirstUserRole(user.get("id"));
      if(!userRole) {
        return this.raiseClientError(res, 422, {}, "User doesn't exists");
      }
      const userRoleWrapper = await UserRolesWrapper(userRole);
      const userRoleId = userRoleWrapper.getId();

      let passwordMatch = false;

      const providerDoctorFirstLogin =
        !user.get("password") && user.get("verified") ? true : false;

      if (user.get("password")) {
        passwordMatch = await bcrypt.compare(password, user.get("password"));
      }

      const doLogin = passwordMatch || providerDoctorFirstLogin ? true : false;

      if (doLogin) {
        if (providerDoctorFirstLogin) {
          const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
          const hash = await bcrypt.hash(password, salt);

          const updateUser = await userService.updateUser(
            {
              password: hash
            },
            user.get("id")
          );
        }

        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userRoleId
          },
          secret,
          {
            expiresIn
          }
        );

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(
          `${userRoleId}`
        );
        const feedId = base64.encode(`${userRoleId}`);

        const apiUserDetails = await MUserWrapper(user.get());

        let permissions = {
          permissions: []
        };

        if (apiUserDetails.isActivated()) {
          permissions = await apiUserDetails.getPermissions();
        }

        return this.raiseSuccess(
          res,
          200,
          {
            accessToken,
            notificationToken,
            feedId,
            users: {
              [apiUserDetails.getId()]: {
                ...apiUserDetails.getBasicInfo()
              }
            },
            auth_user: apiUserDetails.getId(),
            auth_user_role: userRoleId,
            auth_category: apiUserDetails.getCategory(),
            hasConsent: apiUserDetails.getConsent(),
            ...permissions
          },
          "Signed in successfully"
        );
      } else {
        return this.raiseClientError(res, 422, {}, "Invalid Credentials");
      }
    } catch (error) {
      console.log("error sign in  --> ", error);

      // notification
      const crashJob = await AdhocJob.execute("crash", {apiName: "signIn(doctor)"});
      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, crashJob.getEmailTemplate());

      return this.raiseServerError(res);
    }
  };

  signUp = async (req, res) => {
    const { raiseClientError, raiseSuccess, raiseServerError } = this;
    try {
      const { password, email, readTermsOfService = false } = req.body;

      if(!readTermsOfService) {
        return raiseClientError(res, 422, {}, "Please read our Terms of Service before signing up");
      }

      // Email check part
      const userExits = await userService.getUserByEmail({ email });
      if (userExits !== null) {
        let canRegister = false;
        const existingUserCategory = userExits.get("category");
        if(existingUserCategory === USER_CATEGORY.DOCTOR) {
          const existingUserRole = await userRolesService.getAllByData({user_identity: userExits.get("id")});

          if(existingUserRole && existingUserRole.length) {
            for(let i=0; i< existingUserRole.length; i++) {
              const existingRoleWrapper = await UserRolesWrapper(existingUserRole[i]);
              if(!existingRoleWrapper.getLinkedId()) {
                canRegister = false;
                break;
              } else {
                canRegister = true;
              }
            }
          }
        }
        if(!canRegister) {
          return raiseClientError(
            res,
            422,
            errMessage.EMAIL_ALREADY_EXISTS,
            errMessage.EMAIL_ALREADY_EXISTS.message
          );
        }
      }

      let userRoleId = null, userId;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      if(!userExits) {
        // add user and doctor only in the case when there is
        // not any existing account.
        const user = await userService.addUser({
          email,
          password: hash,
          sign_in_type: "basic",
          category: USER_CATEGORY.DOCTOR,
          onboarded: true,
          verified: true
        });

        userId = user.get("id");
        if (user) {
          await doctorService.addDoctor({
            user_id: userId
          });
        }
      } else {
        userId = userExits.get("id")
        if(!userExits.get("password")) {
          const updatedUser = await userService.updateUser({
            password: hash
          }, userId);
        }
      }
      
      const userRole = await userRolesService.create({
        user_identity: userId,
        linked_id: null,
        linked_with: null
      })

      if(userRole) {
        const userRoleWrapper = await UserRolesWrapper(userRole);
        userRoleId = userRoleWrapper.getId();
      }
      
      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day
      const secret = process.config.TOKEN_SECRET_KEY;
      const accessToken = await jwt.sign(
        {
          userRoleId
        },
        secret,
        {
          expiresIn
        }
      );

      const appNotification = new AppNotification();
      const notificationToken = appNotification.getUserToken(
        `${userRoleId}`
      );
      const feedId = base64.encode(`${userRoleId}`);
      const apiUserDetails = await MUserWrapper(null, userId);

      return raiseSuccess(
        res,
        200,
        {
          accessToken,
          notificationToken,
          feedId,
          users: {
            [apiUserDetails.getId()]: {
              ...apiUserDetails.getBasicInfo()
            }
          },
          auth_user: apiUserDetails.getId(),
          auth_user_role: userRoleId,
          auth_category: apiUserDetails.getCategory()
        },
        "Sign up successful"
      );
    } catch (err) {
      Logger.debug("signup 500 error", err);
      console.log("signup err,", err);
      return raiseServerError(res);
    }
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
        accessToken: res.body.access_token
      });
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      useruser;
      throw err;
    }
  }

  onAppStart = async (req, res, next) => {
    let response;
    try {
      if (req.userDetails.exists) {
        const {
          userRoleId = null ,
          userId,
          userData,
          userData: { category, has_consent } = {}
        } = req.userDetails;

        const userApiWrapper = await MUserWrapper(userData);

        let userCategoryData = {};
        let userApiData = {};
        let userCatApiData = {};
        let carePlanApiData = {};
        let providerApiData = {};
        let userCategoryApiData = null;
        let userCategoryId = "";
        let careplanData = [];
        let doctorIds = [];
        let patientIds = [];
        let userIds = [userId];
        let treatmentIds = [];
        let conditionIds = [];

        const serverConstants = getServerSpecificConstants()

        switch (category) {
          case USER_CATEGORY.PATIENT:
            userCategoryData = await patientService.getPatientByUserId(userId);
            if (userCategoryData) {
              userCategoryApiData = await MPatientWrapper(userCategoryData);
              userCategoryId = userCategoryApiData.getPatientId();

              userCatApiData[
                userCategoryApiData.getPatientId()
              ] = userCategoryApiData.getBasicInfo();

              careplanData = await carePlanService.getCarePlanByData({
                patient_id: userCategoryId
              });

              await careplanData.forEach(async carePlan => {
                const carePlanApiWrapper = await MCarePlanWrapper(carePlan);
                doctorIds.push(carePlanApiWrapper.getDoctorId()); // todo--: Here change will come once careplan table gets changed.
                carePlanApiData[
                  carePlanApiWrapper.getCarePlanId()
                ] = carePlanApiWrapper.getBasicInfo();

                const {
                  severity_id,
                  treatment_id,
                  condition_id
                } = carePlanApiWrapper.getCarePlanDetails();
                treatmentIds.push(treatment_id);
                conditionIds.push(condition_id);
              });
            }
            break;
          case USER_CATEGORY.DOCTOR:
            userCategoryData = await doctorService.getDoctorByUserId(userId);

            // Logger.debug("----DOCTOR-----", userCategoryData);
            if (userCategoryData) {
              userCategoryApiData = await MDoctorWrapper(userCategoryData);
              userCategoryId = userCategoryApiData.getDoctorId();

              userCatApiData[
                userCategoryApiData.getDoctorId()
              ] = await userCategoryApiData.getAllInfo();

              const doctorProvider = await doctorProviderMappingService.getProviderForDoctor(
                userCategoryId
              );

              if (doctorProvider) {
                const doctorProviderWrapper = await DoctorProviderMappingWrapper(
                  doctorProvider
                );

                const providerId = doctorProviderWrapper.getProviderId();
                const providerWrapper = await ProvidersWrapper(
                  null,
                  providerId
                );
                providerApiData[
                  providerId
                ] = await providerWrapper.getAllInfo();
              }

              careplanData = await carePlanService.getCarePlanByData({
                user_role_id : userRoleId
              });

              // Logger.debug("careplan mobile doctor", careplanData);

              await careplanData.forEach(async carePlan => {
                const carePlanApiWrapper = await MCarePlanWrapper(carePlan);
                patientIds.push(carePlanApiWrapper.getPatientId());
                carePlanApiData[
                  carePlanApiWrapper.getCarePlanId()
                ] = carePlanApiWrapper.getBasicInfo();

                const {
                  severity_id,
                  treatment_id,
                  condition_id
                } = carePlanApiWrapper.getCarePlanDetails();
                treatmentIds.push(treatment_id);
                conditionIds.push(condition_id);
              });
            }
            break;
          default:
            // todo--: why this as default
            userCategoryData = await patientService.getPatientByData({
              user_id: userId
            });
            userCategoryApiData = await MPatientWrapper(userCategoryData);
            userCategoryId = userCategoryApiData.getPatientId();
        }

        // Logger.debug("doctor ids --> ", doctorIds);

        const doctorData = await doctorService.getDoctorByData({
          id: doctorIds
        });

        let doctorApiDetails = {};

        if (doctorData) {
          await doctorData.forEach(async doctor => {
            const doctorWrapper = await MDoctorWrapper(doctor);
            doctorApiDetails[
              doctorWrapper.getDoctorId()
            ] = doctorWrapper.getBasicInfo();
            userIds.push(doctorWrapper.getUserId());
          });
        }

        let patientApiDetails = {};

        const patientData = await patientService.getPatientByData({
          id: patientIds
        });

        if (patientData) {
          await patientData.forEach(async patient => {
            const patientWrapper = await MPatientWrapper(patient);
            patientApiDetails[
              patientWrapper.getPatientId()
            ] = patientWrapper.getBasicInfo();
            userIds.push(patientWrapper.getUserId());
          });
        }

        let apiUserDetails = {};

        if (userIds.length > 1) {
          const allUserData = await userService.getUserByData({ id: userIds });
          await allUserData.forEach(async user => {
            apiUserDetails = await MUserWrapper(user.get());
            userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();
          });
        } else {
          apiUserDetails = await MUserWrapper(null, userId);
          userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();

          // Logger.debug("userApiData --> ", apiUserDetails.isActivated());
        }

        // treatments
        let treatmentApiDetails = {};
        const treatmentDetails = await treatmentService.getAll();
        treatmentIds = [];

        for (const treatment of treatmentDetails) {
          const treatmentWrapper = await MTreatmentWrapper(treatment);
          treatmentIds.push(treatmentWrapper.getTreatmentId());
          treatmentApiDetails[
            treatmentWrapper.getTreatmentId()
          ] = treatmentWrapper.getBasicInfo();
        }

        // severity
        let severityApiDetails = {};
        let severityIds = [];
        const severityDetails = await severityService.getAll();

        for (const severity of severityDetails) {
          const severityWrapper = await MSeverityWrapper(severity);
          severityIds.push(severityWrapper.getSeverityId());
          severityApiDetails[
            severityWrapper.getSeverityId()
          ] = severityWrapper.getBasicInfo();
        }

        // conditions
        let conditionApiDetails = {};
        const conditionDetails = await conditionService.getAllByData({
          id: conditionIds
        });
        conditionIds = [];

        for (const condition of conditionDetails) {
          const conditionWrapper = await MConditionWrapper(condition);
          conditionIds.push(conditionWrapper.getConditionId());
          conditionApiDetails[
            conditionWrapper.getConditionId()
          ] = conditionWrapper.getBasicInfo();
        }

        let permissions = {
          permissions: []
        };

        if (userApiWrapper.isActivated()) {
          permissions = await userApiWrapper.getPermissions();
        }

        // speciality temp todo
        let referenceData = {};
        if (userCategoryApiData && category === USER_CATEGORY.DOCTOR) {
          referenceData = await userCategoryApiData.getReferenceInfo();
        }

        Logger.debug("Reference data ---> ", referenceData);

        const dataToSend = {
          users: {
            ...userApiData
          },
          [`${category}s`]: {
            ...userCatApiData
          },
          [category === USER_CATEGORY.DOCTOR ? "patients" : "doctors"]:
            category === USER_CATEGORY.DOCTOR
              ? { ...patientApiDetails }
              : { ...doctorApiDetails },
          care_plans: {
            ...carePlanApiData
          },
          providers: {
            ...providerApiData
          },
          severity: {
            ...severityApiDetails
          },
          conditions: {
            ...conditionApiDetails
          },
          treatments: {
            ...treatmentApiDetails
          },
          ...referenceData,
          ...permissions,

          severity_ids: severityIds,
          condition_ids: conditionIds,
          treatment_ids: treatmentIds,
          auth_user: userId,
          auth_category: category,
          hasConsent: has_consent,
          server_constants: serverConstants
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

  forgotPassword = async (req, res) => {
    const { raiseServerError } = this;
    try {
      const { raiseClientError, raiseSuccess } = this;
      const { email } = req.body;
      const userExists = await userService.getUserByEmail({
        email
      });

      if (userExists) {
        const userWrapper = await MUserWrapper(userExists.get());
        const link = uuidv4();
        const status = "verified"; //make it pending completing flow with verify permission
        // const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        // const hash = await bcrypt.hash(password, salt);

        const userVerification = UserVerificationServices.addRequest({
          user_id: userWrapper.getId(),
          request_id: link,
          status: "pending",
          type: VERIFICATION_TYPE.FORGOT_PASSWORD
        });
        // let uId = userInfo.get("id");

        Logger.debug(
          "process.config.WEB_URL --------------->",
          process.config.WEB_URL
        );

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
        return raiseClientError(
          res,
          422,
          {},
          "User does not exists for the email"
        );
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
  };

  verifyPasswordResetLink = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { params: { link } = {} } = req;

      const passwordResetLink = await UserVerificationServices.getRequestByLink(
        link
      );

      if (passwordResetLink) {
        const linkVerificationData = await LinkVerificationWrapper(
          passwordResetLink
        );

        const userData = await UserWrapper(
          null,
          linkVerificationData.getUserId()
        );
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

        return raiseSuccess(
          res,
          200,
          {
            accessToken,
            users: {
              [userData.getId()]: {
                ...userData.getBasicInfo()
              }
            }
          },
          "Email verified for password reset"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Cannot verify email to update password"
        );
      }
    } catch (error) {
      Logger.debug("updateUserPassword 500 error", error);
      return raiseServerError(res);
    }
  };

  updateUserPassword = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const {
        userDetails: { userId },
        body: { new_password, confirm_password } = {}
      } = req;

      if (new_password !== confirm_password) {
        return raiseClientError(res, 422, {}, "Password does not match");
      }

      const user = await userService.getUserById(userId);
      Logger.debug("user -------------->", user);
      const userData = await UserWrapper(user.get());

      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(new_password, salt);

      const updateUser = await userService.updateUser(
        {
          password: hash
          // system_generated_password: false
        },
        userId
      );

      const updatedUser = await UserWrapper(null, userId);

      return raiseSuccess(
        res,
        200,
        {
          users: {
            [updatedUser.getId()]: updatedUser.getBasicInfo()
          }
        },
        "Password reset successful. Please login to continue"
      );
    } catch (error) {
      Logger.debug("updateUserPassword 500 error", error);
      return raiseServerError(res);
    }
  };

  verifyPatientLink = async (req, res) => {
    const { raiseServerError, raiseSuccess, raiseClientError } = this;
    try {
      const { params: { link } = {} } = req;

      const patientVerifyLink = await UserVerificationServices.getRequestByLink(
        link
      );

      if (patientVerifyLink) {
        const linkVerificationData = await LinkVerificationWrapper(
          patientVerifyLink
        );

        const userData = await UserWrapper(
          null,
          linkVerificationData.getUserId()
        );
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

        return raiseSuccess(
          res,
          200,
          {
            accessToken,
            users: {
              [userData.getId()]: {
                ...userData.getBasicInfo()
              }
            }
          },
          "Email verified for password reset"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Cannot verify email to update password"
        );
      }
    } catch (error) {
      Logger.debug("updateUserPassword 500 error", error);
      return raiseServerError(res);
    }
  };

  updatePassword = async (req, res) => {
    try {
      const {
        body: { new_password, confirm_password } = {},
        userDetails: { userId, userData: { category } = {} } = {}
      } = req;

      if (new_password !== confirm_password) {
        return this.raiseClientError(res, 422, {}, "Password does not match");
      }
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(new_password, salt);

      const updateUser = await userService.updateUser(
        {
          password: hash
          // system_generated_password: false
        },
        userId
      );

      const updatedUser = await UserWrapper(null, userId);

      let categoryData = {};

      switch (category) {
        case USER_CATEGORY.PATIENT:
          const patient = await patientService.getPatientByUserId(userId);
          const patientData = await MPatientWrapper(patient);
          categoryData[patientData.getPatientId()] = patientData.getBasicInfo();
          break;
        case USER_CATEGORY.DOCTOR:
          const doctor = await doctorService.getDoctorByUserId(userId);
          const doctorData = await MDoctorWrapper(doctor);
          categoryData[doctorData.getDoctorId()] = doctorData.getBasicInfo();
          break;
        default:
      }

      return this.raiseSuccess(
        res,
        200,
        {
          users: {
            [updatedUser.getId()]: updatedUser.getBasicInfo()
          },
          [`${category}s`]: {
            ...categoryData
          }
        },
        "Password updated successfully"
      );
    } catch (error) {
      Logger.debug("updatePassword 500 error", error);
      return this.raiseServerError(res);
    }
  };

  giveConsent = async (req,res) => {
    const {raiseClientError} = this;
    try{
      const {userDetails: {userId, userRoleId} = {}, body: {agreeConsent} = {}} = req;

      Logger.info(`1897389172 agreeConsent :: ${agreeConsent} | userId : ${userId}`);

      if(!agreeConsent) {
        return raiseClientError(res, 422, {}, "Cannot proceed without accepting Terms of Service");
      }

      //update
      await userService.updateUser(
          {
            has_consent: agreeConsent
          },
          userId
      );


      // const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

      // const secret = process.config.TOKEN_SECRET_KEY;
      // const accessToken = await jwt.sign(
      //     {
      //       userRoleId
      //     },
      //     secret,
      //     {
      //       expiresIn
      //     }
      // );

      // const appNotification = new AppNotification();

      // const notificationToken = appNotification.getUserToken(
      //     `${userRoleId}`
      // );
      // const feedId = base64.encode(`${userRoleId}`);

      const userRef = await userService.getUserData({ id: userId });

      const apiUserDetails = await MUserWrapper(userRef.get());

      // let permissions = {
      //   permissions: []
      // };

      // if (apiUserDetails.isActivated()) {
      //   permissions = await apiUserDetails.getPermissions();
      // }

      const dataToSend = {
        ...(await apiUserDetails.getReferenceInfo()),
        auth_user: apiUserDetails.getId(),
        auth_user_role: userRoleId,
        // notificationToken: notificationToken,
        // feedId,
        hasConsent: apiUserDetails.getConsent(),
        auth_category: apiUserDetails.getCategory()
      };

      // res.cookie("accessToken", accessToken, {
      //   expires: new Date(
      //       Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
      //   ),
      //   httpOnly: true
      // });

      return this.raiseSuccess(
          res,
          200,
          { ...dataToSend },
          "Initial data retrieved successfully"
      );


    }catch(error){
      Logger.debug("giveConsent 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  }
}

export default new MobileUserController();
