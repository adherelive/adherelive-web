const { OAuth2Client } = require("google-auth-library");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const request = require("request");
const chalk = require("chalk");
import base64 from "js-base64";
import bcrypt from "bcrypt";

import Log from "../../../libs/log";
// import fs from "fs";
const Response = require("../helper/responseFormat");
import userService from "../../services/user/user.service";
import patientService from "../../services/patients/patients.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import treatmentService from "../../services/treatment/treatment.service";
import severityService from "../../services/severity/severity.service";
import conditionService from "../../services/condition/condition.service";
import providerService from "../../services/provider/provider.service";
import doctorProviderMappingService from "../../services/doctorProviderMapping/doctorProviderMapping.service";
import userRolesService from '../../services/userRoles/userRoles.service';

import UserWrapper from "../../ApiWrapper/web/user";
import DoctorWrapper from "../../ApiWrapper/web/doctor";
import PatientWrapper from "../../ApiWrapper/web/patient";
import CarePlanWrapper from "../../ApiWrapper/web/carePlan";
import TreatmentWrapper from "../../ApiWrapper/web/treatments";
import SeverityWrapper from "../../ApiWrapper/web/severity";
import ConditionWrapper from "../../ApiWrapper/web/conditions";
import ProvidersWrapper from "../../ApiWrapper/web/provider";
import DoctorProviderMappingWrapper from "../../ApiWrapper/web/doctorProviderMapping";
import UserRolesWrapper from "../../ApiWrapper/web/userRoles";

import doctorService from "../../services/doctors/doctors.service";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";
import Controller from "../index";
import {
  uploadImageS3,
  createNewUser
} from "./userHelper";
import { v4 as uuidv4 } from "uuid";
import constants from "../../../config/constants";
import {
  EMAIL_TEMPLATE_NAME,
  USER_CATEGORY,
  VERIFICATION_TYPE
} from "../../../constant";
import { Proxy_Sdk, EVENTS } from "../../proxySdk";
// import  EVENTS from "../../proxySdk/proxyEvents";
const errMessage = require("../../../config/messages.json").errMessages;
import { getCarePlanSeverityDetails } from "../carePlans/carePlanHelper";
import LinkVerificationWrapper from "../../ApiWrapper/mobile/userVerification";

import AppNotification from "../../NotificationSdk/inApp";
import AdhocJob from "../../JobSdk/Adhoc/observer";

const Logger = new Log("WEB USER CONTROLLER");

class UserController extends Controller {
  constructor() {
    super();
  }

  signUp= async (req, res) => {
    const {raiseClientError, raiseServerError, raiseSuccess} = this;
    try {
        const {body: {password, email, readTermsOfService = false} = {}} = req;

      if(!readTermsOfService) {
        return this.raiseClientError(res, 422, {}, "Please read our Terms of Service before signing up");
      }

      const newUser = await createNewUser(email, password, null);

      return raiseSuccess(
          res,
          200,
          {},
          "Signed up successfully. Please check your email to proceed"
      );
    } catch (err) {
      console.log("signup err,", err);
      if (err.code && err.code == 11000) {
        let response = new Response(false, 400);
        response.setError(errMessage.EMAIL_ALREADY_EXISTS);
        // response.setMessage(errMessage.EMAIL_ALREADY_EXISTS);
        return res.status(400).json(response.getResponse());
      } else {
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        // response.setMessage(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
      }
    }
  }

  verifyUser = async (req, res) => {
    const {raiseSuccess, raiseClientError, raiseServerError} = this;
    try {
      const {params: {link} = {}} = req;
      Logger.info(`(request)(param) LINK :: ${link}`);
      const verifications = await UserVerificationServices.getRequestByLink(link);

      const {user_id: userId} = verifications.get("") || {};

      const userData = await userService.getUserById(userId);
      const {verified: isVerified} = userData.get("") || {};

      if (!isVerified) {
        await UserVerificationServices.updateVerification(
          { status: "verified" },
          link
        );

        // let activated_on = moment();
        const user = await userService.updateUser({verified: true}, userId);

        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;

        const accessToken = await jwt.sign(
          {
            userId
          },
          secret,
          {
            expiresIn
          }
        );

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(
          `${userId}`
        );
        // const feedId = base64.encode(`${userId}`);

        const apiUserDetails = await UserWrapper(null, userId);

        const dataToSend = {
          users: {
            [apiUserDetails.getId()]: {
              ...apiUserDetails.getBasicInfo()
            }
          },
          notificationToken: notificationToken,
          feedId: `${userId}`,
          auth_user: apiUserDetails.getId(),
          auth_category: apiUserDetails.getCategory()
        };

        // res.redirect("/sign-in");
        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true
        });

        return raiseSuccess(
          res,
          200,
          { ...dataToSend },
          "user verified successfully"
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "This verification link is expired!"
        );
      }
    } catch (error) {
      Logger.debug("verifyUser 500 error", error);
      // res.redirect("/sign-in");
      return raiseServerError(res);
    }
  };

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail({
        email
      });

      Logger.debug("983675754629384652479238094862387",{user});

      
      if (!user) {
        return this.raiseClientError(res, 422, user, "Email doesn't exists");
      }

      const userRole = await userRolesService.getFirstUserRole(user.get("id"));
      if(!userRole) {
        return this.raiseClientError(res, 422, {}, "User doesn't exists");
      }

      const userRoleWrapper = await UserRolesWrapper(userRole);
      const userRoleId = userRoleWrapper.getId();

      // let verified = user.get("verified");
      //
      // if (!verified) {
      //   return this.raiseClientError(res, 401, "user account not verified");
      // }

      // TODO: UNCOMMENT below code after signup done for password check or seeder

      let passwordMatch = false;

      const providerDoctorFirstLogin =
        !user.get("password") && user.get("verified") ? true : false;

      if (user.get("password")) {
        passwordMatch = await bcrypt.compare(password, user.get("password"));
      }

      const doLogin = passwordMatch || providerDoctorFirstLogin ? true : false;

      const consent = user.get("has_consent");

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

        // if(!consent){
        //   return this.raiseClientError(
        //       res,
        //       422,
        //       {
        //         userId : user.get("id")
        //       },
        //       "User consent required to proceed further."
        //     );
        // }

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

        // Logger.debug("notificationToken --> ", notificationToken);
        // Logger.debug("feedId --> ", feedId);

        const userRef = await userService.getUserData({ id: user.get("id") });

        const apiUserDetails = await UserWrapper(userRef.get());

        let permissions = {
          permissions: []
        };

        if (apiUserDetails.isActivated()) {
          permissions = await apiUserDetails.getPermissions();
          Logger.debug("675546767890876678", apiUserDetails.getBasicInfo());
        }

        const dataToSend = {
          // users: {
          //   [apiUserDetails.getId()]: apiUserDetails.getBasicInfo(),
          // },
          // ...permissions,
          ...(await apiUserDetails.getReferenceData()),
          auth_user: apiUserDetails.getId(),
          auth_user_role: userRoleId,
          notificationToken: notificationToken,
          feedId,
          auth_category: apiUserDetails.getCategory(),
          hasConsent: apiUserDetails.getConsent(),
        };

        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true
        });

        // res.cookie("notificationToken", notificationToken, {
        //   expires: new Date(
        //     Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        //   ),
        //   httpOnly: true
        // });
        //
        // res.cookie("feedId", feedId, {
        //   expires: new Date(
        //     Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        //   ),
        //   httpOnly: true
        // });

        return this.raiseSuccess(
          res,
          200,
          { ...dataToSend },
          "Initial data retrieved successfully"
        );
      } else {
        return this.raiseClientError(res, 401, {}, "Invalid Credentials");
      }
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);

      // notification
      const crashJob = await AdhocJob.execute("crash", {apiName: "signIn"});
      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, crashJob.getEmailTemplate());

      return this.raiseServerError(res);
    }
  };

  giveConsent = async (req,res) => {
    const {raiseClientError} = this;
    try{
      const {userDetails: {userId} = {}, body: {agreeConsent} = {}} = req;

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


      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

      const secret = process.config.TOKEN_SECRET_KEY;
      const accessToken = await jwt.sign(
          {
            userId
          },
          secret,
          {
            expiresIn
          }
      );

      const appNotification = new AppNotification();

      const notificationToken = appNotification.getUserToken(
          `${userId}`
      );
      // const feedId = base64.encode(`${userId}`);

      const userRef = await userService.getUserData({ id: userId });

      const apiUserDetails = await UserWrapper(userRef.get());

      // let permissions = {
      //   permissions: []
      // };

      // if (apiUserDetails.isActivated()) {
      //   permissions = await apiUserDetails.getPermissions();
      // }

      const dataToSend = {
        ...(await apiUserDetails.getReferenceInfo()),
        auth_user: apiUserDetails.getId(),
        notificationToken: notificationToken,
        feedId: `${userId}`,
        hasConsent: apiUserDetails.getConsent(),
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
          "Initial data retrieved successfully"
      );


    }catch(error){
      Logger.debug("giveConsent 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  }

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
          userData: { category } = {},
          userCategoryData: uC = {}
        } = req.userDetails;

        // const user = await userService.getUserById(userId);

        // Logger.debug("user data in request", userData);

        // const userDetails = user[0];

        const authUserDetails = await UserWrapper(userData);

        let userCategoryData = {};
        let carePlanApiData = {};
        let userApiData = {};
        let userCaregoryApiData = {};
        let providerApiData = {};

        let userCategoryApiWrapper = null;
        let userCategoryId = null;
        let patientIds = [];
        let userIds = [userId];
        let careplanData = [];

        let treatmentIds = [];
        let conditionIds = [];
        let doctorProviderId=null;

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
              ] = await userCategoryApiWrapper.getAllInfo();

              const doctorProvider = await doctorProviderMappingService.getProviderForDoctor(
                userCategoryId
              );

              if (doctorProvider) {
                const doctorProviderWrapper = await DoctorProviderMappingWrapper(
                  doctorProvider
                );
                const providerId = doctorProviderWrapper.getProviderId();
                doctorProviderId=providerId;
                const providerWrapper = await ProvidersWrapper(
                  null,
                  providerId
                );
                providerApiData[
                  providerId
                ] = await providerWrapper.getAllInfo();
              }

              careplanData = await carePlanService.getCarePlanByData({
                doctor_id: userCategoryId
              });

              for (const carePlan of careplanData) {
                const carePlanApiWrapper = await CarePlanWrapper(carePlan);
                patientIds.push(carePlanApiWrapper.getPatientId());
                const carePlanId = carePlanApiWrapper.getCarePlanId();

                const {
                  appointment_ids = [],
                  medication_ids = [],
                  vital_ids = []
                } = await carePlanApiWrapper.getAllInfo();

                let carePlanSeverityDetails = await getCarePlanSeverityDetails(
                  carePlanId
                );

                const {
                  treatment_id,
                  severity_id,
                  condition_id
                } = carePlanApiWrapper.getCarePlanDetails();
                treatmentIds.push(treatment_id);
                conditionIds.push(condition_id);
                carePlanApiData[carePlanApiWrapper.getCarePlanId()] =
                  // carePlanApiWrapper.getBasicInfo();
                  {
                    ...carePlanApiWrapper.getBasicInfo(),
                    ...carePlanSeverityDetails,
                    medication_ids,
                    appointment_ids,
                    vital_ids
                  };
              }
            }
            break;
          case USER_CATEGORY.PROVIDER:
            userCategoryData = await providerService.getProviderByData({
              user_id: userId
            });
            if (userCategoryData) {
              userCategoryApiWrapper = await ProvidersWrapper(userCategoryData);
              userCaregoryApiData[
                userCategoryApiWrapper.getProviderId()
              ] = await userCategoryApiWrapper.getAllInfo();
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
        const patientsData = await patientService.getPatientByData({
          id: patientIds
        });

        let patientApiDetails = {};

        if (patientsData) {
          for (const patient of patientsData) {
            const patientWrapper = await PatientWrapper(patient);
            patientApiDetails[
              patientWrapper.getPatientId()
            ] = await patientWrapper.getAllInfo();
            userIds.push(patientWrapper.getUserId());
          }
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
        const treatmentDetails = await treatmentService.getAll();
        treatmentIds = [];
        for (const treatment of treatmentDetails) {
          const treatmentWrapper = await TreatmentWrapper(treatment);
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
          const severityWrapper = await SeverityWrapper(severity);
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
          const conditionWrapper = await ConditionWrapper(condition);
          conditionIds.push(conditionWrapper.getConditionId());
          conditionApiDetails[
            conditionWrapper.getConditionId()
          ] = conditionWrapper.getBasicInfo();
        }

        let permissions = {
          permissions: []
        };

        if (authUserDetails.isActivated()) {
          permissions = await authUserDetails.getPermissions();
        }

        Logger.debug(
          "authUserDetails.isActivated() --> ",
          authUserDetails.isActivated()
        );
        // Logger.debug("permissions --> ", permissions);

        // speciality temp todo
        let referenceData = {};
        if (category === USER_CATEGORY.DOCTOR && userCategoryApiWrapper) {
          referenceData = await userCategoryApiWrapper.getReferenceInfo();
        }

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(`${userId}`);
        const feedId = base64.encode(`${userId}`);

        let response = {
          ...referenceData,
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
          notificationToken: notificationToken,
          feedId: `${userId}`,
          severity: {
            ...severityApiDetails
          },
          treatments: {
            ...treatmentApiDetails
          },
          conditions: {
            ...conditionApiDetails
          },
          ...permissions,
          severity_ids: severityIds,
          treatment_ids: treatmentIds,
          condition_ids: conditionIds,
          auth_user: userId,
          auth_category: category,
          [category === USER_CATEGORY.DOCTOR  ? "doctor_provider_id" : ""]:
            category === USER_CATEGORY.DOCTOR
            ? doctorProviderId
            : "",  
        };

        if (category !== USER_CATEGORY.PROVIDER) {
          response = { ...response, ...{ providers: { ...providerApiData } } };
        }

        return this.raiseSuccess(res, 200, response, "basic info");
      } else {
        console.log("userExists --->>> ", req.userDetails.exists);
        // throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      Logger.debug("onAppStart 500 error", err);
      return this.raiseServerError(res);
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

        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true
        });

        return raiseSuccess(
          res,
          200,
          {
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

      if (req.cookies.accessToken) {
        res.clearCookie("accessToken");

        return this.raiseSuccess(
          res,
          200,
          {},
          "Password reset successful. Please login to continue"
        );
      } else {
        return this.raiseClientError(res, 422, {}, constants.COOKIES_NOT_SET);
        // let response = new Response(false, 500);
        // response.setError(errMessage.INTERNAL_SERVER_ERROR);
        // return res.status(500).json(response.getResponse());
      }
    } catch (error) {
      Logger.debug("updateUserPassword 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new UserController();
