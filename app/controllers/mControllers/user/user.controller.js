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
import userRolesService from "../../../services/userRoles/userRoles.service";
import userPreferenceService from "../../../services/userPreferences/userPreference.service";

import DoctorPatientWatchlistWrapper from "../../../ApiWrapper/mobile/doctorPatientWatchlist";
import doctorPatientWatchlistService from "../../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";

import { getServerSpecificConstants } from "./userHelper";
import { v4 as uuidv4 } from "uuid";
import {
  DOCTOR_TYPE_PROFILES,
  EMAIL_TEMPLATE_NAME,
  NO_ACTION,
  NO_APPOINTMENT,
  NO_MEDICATION,
  USER_CATEGORY,
  VERIFICATION_TYPE,
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
import { getSeparateName } from "../../../helper/common";

const Logger = new Log("MOBILE USER CONTROLLER");

class MobileUserController extends Controller {
  doctorProviderId;

  constructor() {
    super();
  }

  signIn = async (req, res) => {
    try {
      const { prefix, mobile_number, hash = "" } = req.body;
      Logger.info(`Password hash :: ${hash}`);
      const user = await userService.getUserByNumber({ mobile_number, prefix });

      // const userDetails = user[0];
      // console.log("userDetails --> ", userDetails);
      if (!user) {
        return this.raiseClientError(
          res,
          422,
          user,
          "Mobile Number does not exist"
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
        user_id: apiUserDetails.getId(),
      });

      const patientOtpVerification = await otpVerificationService.create({
        user_id: apiUserDetails.getId(),
        otp,
      });

      if (process.config.app.env === "development") {
        const emailPayload = {
          title: "OTP verification for demo",
          toAddress: process.config.app.developer_email,
          templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
          templateData: {
            title: "Demo Patient",
            mainBodyText: "OTP for the Demo AdhereLive patient login is",
            subBodyText: otp,
            host: process.config.WEB_URL,
            contactTo: process.config.app.support_email,
          },
        };
        Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
        Logger.info(`OTP :::: ${otp}`);
      } else {
        // if(apiUserDetails.getEmail()) {
        const emailPayload = {
          title: "OTP verification for AdhereLive",
          toAddress: process.config.app.developer_email,
          templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
          templateData: {
            title: "Patient Login",
            mainBodyText: "OTP for patient login on AdhereLive is",
            subBodyText: otp,
            host: process.config.WEB_URL,
            contactTo: process.config.app.support_email,
          },
        };
        Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);
        // }

        const smsPayload = {
          // countryCode: prefix,
          phoneNumber: `+${apiUserDetails.getPrefix()}${mobile_number}`,
          message: `<#> Hello from AdhereLive! Your OTP for login is ${otp}  /${hash}`,
        };

        Proxy_Sdk.execute(EVENTS.SEND_SMS, smsPayload);
      }

      // const emailPayload = {
      //   title: "OTP Verification for patient",
      //   toAddress: process.config.app.developer_email,
      //   templateName: EMAIL_TEMPLATE_NAME.OTP_VERIFICATION,
      //   templateData: {
      //     title: "Patient",
      //     mainBodyText: "OTP for the AdhereLive patient login is",
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
          user_id: apiUserDetails.getId(),
        },
        "OTP sent successfully"
      );
      // } else {
      //   return this.raiseClientError(res, 422, {}, "Invalid Credentials");
      // }
    } catch (error) {
      console.log("error sign in with OTP  --> ", error);

      // notification
      const crashJob = await AdhocJob.execute("crash", {
        apiName: "signIn(patient)",
      });
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
        user_id,
      });

      Logger.debug("otpDetails --> ", otpDetails);

      if (otpDetails.length > 0) {
        const destroyOtp = await otpVerificationService.delete({ user_id });
        const userDetails = await userService.getUserById(
          otpDetails[0].get("user_id")
        );

        const userData = await MUserWrapper(userDetails.get());
        let permissions = [];

        if (userData.isActivated()) {
          permissions = await userData.getPermissions();
        }

        const userRole = await userRolesService.getFirstUserRole(
          userData.getId()
        );
        if (!userRole) {
          return this.raiseClientError(res, 422, {}, "User doesn't exists");
        }
        const userRoleWrapper = await UserRolesWrapper(userRole);
        const userRoleId = userRoleWrapper.getId();
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day
        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userRoleId,
          },
          secret,
          {
            expiresIn,
          }
        );

        const appNotification = new AppNotification();
        const notificationToken = appNotification.getUserToken(`${userRoleId}`);
        const feedId = base64.encode(`${userRoleId}`);

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
                ...userData.getBasicInfo(),
              },
            },
            auth_user: userData.getId(),
            auth_user_role: userRoleId,
            auth_category: userData.getCategory(),
            hasConsent: userData.getConsent(),
            permissions,
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

      if (
        user.get("category") !== USER_CATEGORY.DOCTOR &&
        user.get("category") !== USER_CATEGORY.HSP
      ) {
        return this.raiseClientError(res, 422, {}, "Unauthorized");
      }

      // TODO: UNCOMMENT below code after signup done for password check or seeder

      const userRole = await userRolesService.getFirstUserRole(user.get("id"));
      if (!userRole) {
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
              password: hash,
            },
            user.get("id")
          );
        }

        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userRoleId,
          },
          secret,
          {
            expiresIn,
          }
        );

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(`${userRoleId}`);
        const feedId = base64.encode(`${userRoleId}`);

        const apiUserDetails = await MUserWrapper(user.get());

        let permissions = {
          permissions: [],
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
                ...apiUserDetails.getBasicInfo(),
              },
            },
            auth_user: apiUserDetails.getId(),
            auth_user_role: userRoleId,
            auth_category: apiUserDetails.getCategory(),
            hasConsent: apiUserDetails.getConsent(),
            permissions,
          },
          "Signed in successfully"
        );
      } else {
        return this.raiseClientError(res, 422, {}, "Invalid Credentials");
      }
    } catch (error) {
      console.log("error sign in  --> ", error);

      // notification
      const crashJob = await AdhocJob.execute("crash", {
        apiName: "signIn(doctor)",
      });
      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, crashJob.getEmailTemplate());

      return this.raiseServerError(res);
    }
  };

  signUp = async (req, res) => {
    const { raiseClientError, raiseSuccess, raiseServerError } = this;
    try {
      const { password, email, readTermsOfService = false } = req.body;

      if (!readTermsOfService) {
        return raiseClientError(
          res,
          422,
          {},
          "Please read our Terms of Service before signing up"
        );
      }

      // Email check part
      const userExits = await userService.getUserByEmail({ email });
      if (userExits !== null) {
        let canRegister = false;
        const existingUserCategory = userExits.get("category");
        if (
          existingUserCategory === USER_CATEGORY.DOCTOR ||
          existingUserCategory === USER_CATEGORY.HSP
        ) {
          const existingUserRole = await userRolesService.getAllByData({
            user_identity: userExits.get("id"),
          });

          if (existingUserRole && existingUserRole.length) {
            for (let i = 0; i < existingUserRole.length; i++) {
              const existingRoleWrapper = await UserRolesWrapper(
                existingUserRole[i]
              );
              if (!existingRoleWrapper.getLinkedId()) {
                canRegister = false;
                break;
              } else {
                canRegister = true;
              }
            }
          }
        }
        if (!canRegister) {
          return raiseClientError(
            res,
            422,
            errMessage.EMAIL_ALREADY_EXISTS,
            errMessage.EMAIL_ALREADY_EXISTS.message
          );
        }
      }

      let userRoleId = null,
        userId;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      if (!userExits) {
        // add user and doctor only in the case when there is
        // not any existing account.
        const user = await userService.addUser({
          email,
          password: hash,
          sign_in_type: "basic",
          category: USER_CATEGORY.DOCTOR,
          onboarded: true,
          verified: true,
        });

        userId = user.get("id");
        if (user) {
          await doctorService.addDoctor({
            user_id: userId,
          });
        }
      } else {
        userId = userExits.get("id");
        if (!userExits.get("password")) {
          const updatedUser = await userService.updateUser(
            {
              password: hash,
            },
            userId
          );
        }
      }

      const userRole = await userRolesService.create({
        user_identity: userId,
        linked_id: null,
        linked_with: null,
      });

      if (userRole) {
        const userRoleWrapper = await UserRolesWrapper(userRole);
        userRoleId = userRoleWrapper.getId();
      }

      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day
      const secret = process.config.TOKEN_SECRET_KEY;
      const accessToken = await jwt.sign(
        {
          userRoleId,
        },
        secret,
        {
          expiresIn,
        }
      );

      const appNotification = new AppNotification();
      const notificationToken = appNotification.getUserToken(`${userRoleId}`);
      const feedId = base64.encode(`${userRoleId}`);
      const apiUserDetails = await MUserWrapper(null, userId);

      await userPreferenceService.addUserPreference({
        user_id: userId,
        details: {
          charts: [NO_MEDICATION, NO_APPOINTMENT, NO_ACTION],
        },
        user_role_id: userRoleId,
      });

      return raiseSuccess(
        res,
        200,
        {
          accessToken,
          notificationToken,
          feedId,
          users: {
            [apiUserDetails.getId()]: {
              ...apiUserDetails.getBasicInfo(),
            },
          },
          auth_user: apiUserDetails.getId(),
          auth_user_role: userRoleId,
          auth_category: apiUserDetails.getCategory(),
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
        accessToken: res.body.access_token,
      });
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      useruser;
      throw err;
    }
  }

  onAppStart = async (req, res) => {
    let response;
    try {
      if (req.userDetails.exists) {
        const {
          userId,
          userRoleId,
          userData,
          userData: { category, has_consent } = {},
        } = req.userDetails;

        const userApiWrapper = await MUserWrapper(userData);

        let userCategoryData = {};
        let userApiData = {};
        let userCatApiData = {};
        let userRolesData = {};
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

        const serverConstants = getServerSpecificConstants();

        switch (category) {
          case USER_CATEGORY.PATIENT:
            userCategoryData = await patientService.getPatientByUserId(userId);
            if (userCategoryData) {
              userCategoryApiData = await MPatientWrapper(userCategoryData);
              userCategoryId = userCategoryApiData.getPatientId();

              userCatApiData[userCategoryApiData.getPatientId()] =
                userCategoryApiData.getBasicInfo();

              careplanData = await carePlanService.getCarePlanByData({
                patient_id: userCategoryId,
              });

              await careplanData.forEach(async (carePlan) => {
                const carePlanApiWrapper = await MCarePlanWrapper(carePlan);
                doctorIds.push(carePlanApiWrapper.getDoctorId());
                carePlanApiData[carePlanApiWrapper.getCarePlanId()] =
                  await carePlanApiWrapper.getAllInfo();

                const { severity_id, treatment_id, condition_id } =
                  carePlanApiWrapper.getCarePlanDetails();
                treatmentIds.push(treatment_id);
                conditionIds.push(condition_id);
              });
            }
            break;
          case USER_CATEGORY.DOCTOR:
          case USER_CATEGORY.HSP:
            userCategoryData = await doctorService.getDoctorByUserId(userId);

            // Logger.debug("----DOCTOR-----", userCategoryData);
            if (userCategoryData) {
              userCategoryApiData = await MDoctorWrapper(userCategoryData);
              userCategoryId = userCategoryApiData.getDoctorId();

              let watchlist_patient_ids = [];
              const watchlistRecords =
                await doctorPatientWatchlistService.getAllByData({
                  user_role_id: userRoleId,
                });
              if (watchlistRecords && watchlistRecords.length) {
                for (let i = 0; i < watchlistRecords.length; i++) {
                  const watchlistWrapper = await DoctorPatientWatchlistWrapper(
                    watchlistRecords[i]
                  );
                  const patientId = await watchlistWrapper.getPatientId();
                  watchlist_patient_ids.push(patientId);
                }
              }

              let allInfo = {};
              allInfo = await userCategoryApiData.getAllInfo();
              delete allInfo.watchlist_patient_ids;
              allInfo["watchlist_patient_ids"] = watchlist_patient_ids;

              userCatApiData[userCategoryApiData.getDoctorId()] = allInfo;

              careplanData = await carePlanService.getCarePlanByData({
                user_role_id: userRoleId,
              });

              // Logger.debug("careplan mobile doctor", careplanData);

              await careplanData.forEach(async (carePlan) => {
                const carePlanApiWrapper = await MCarePlanWrapper(carePlan);
                patientIds.push(carePlanApiWrapper.getPatientId());
                carePlanApiData[carePlanApiWrapper.getCarePlanId()] =
                  await carePlanApiWrapper.getAllInfo();

                const { severity_id, treatment_id, condition_id } =
                  carePlanApiWrapper.getCarePlanDetails();
                treatmentIds.push(treatment_id);
                conditionIds.push(condition_id);
              });
            }
            break;
          // case USER_CATEGORY.HSP:
          //   userCategoryData = await doctorService.getDoctorByUserId(userId);

          //   // Logger.debug("----DOCTOR-----", userCategoryData);
          //   if (userCategoryData) {
          //     userCategoryApiData = await MDoctorWrapper(userCategoryData);
          //     userCategoryId = userCategoryApiData.getDoctorId();

          //     let watchlist_patient_ids = [];
          //     const watchlistRecords = await doctorPatientWatchlistService.getAllByData(
          //       { user_role_id: userRoleId }
          //     );
          //     if (watchlistRecords && watchlistRecords.length) {
          //       for (let i = 0; i < watchlistRecords.length; i++) {
          //         const watchlistWrapper = await DoctorPatientWatchlistWrapper(
          //           watchlistRecords[i]
          //         );
          //         const patientId = await watchlistWrapper.getPatientId();
          //         watchlist_patient_ids.push(patientId);
          //       }
          //     }

          //     let allInfo = {};
          //     allInfo = await userCategoryApiData.getAllInfo();
          //     delete allInfo.watchlist_patient_ids;
          //     allInfo["watchlist_patient_ids"] = watchlist_patient_ids;

          //     userCatApiData[userCategoryApiData.getDoctorId()] = allInfo;

          //     careplanData = await carePlanService.getCarePlanByData({
          //       user_role_id: userRoleId,
          //     });

          //     // Logger.debug("careplan mobile doctor", careplanData);

          //     await careplanData.forEach(async (carePlan) => {
          //       const carePlanApiWrapper = await MCarePlanWrapper(carePlan);
          //       patientIds.push(carePlanApiWrapper.getPatientId());
          //       carePlanApiData[
          //         carePlanApiWrapper.getCarePlanId()
          //       ] = carePlanApiWrapper.getBasicInfo();

          //       const {
          //         severity_id,
          //         treatment_id,
          //         condition_id,
          //       } = carePlanApiWrapper.getCarePlanDetails();
          //       treatmentIds.push(treatment_id);
          //       conditionIds.push(condition_id);
          //     });
          //   }
          //   break;

          default:
            // todo--: why this as default
            userCategoryData = await patientService.getPatientByData({
              user_id: userId,
            });
            userCategoryApiData = await MPatientWrapper(userCategoryData);
            userCategoryId = userCategoryApiData.getPatientId();
        }

        // Logger.debug("doctor ids --> ", doctorIds);

        const doctorData = await doctorService.getDoctorByData({
          id: doctorIds,
        });

        let doctorApiDetails = {};

        if (doctorData) {
          await doctorData.forEach(async (doctor) => {
            const doctorWrapper = await MDoctorWrapper(doctor);
            doctorApiDetails[doctorWrapper.getDoctorId()] =
              doctorWrapper.getBasicInfo();
            userIds.push(doctorWrapper.getUserId());
          });
        }

        let patientApiDetails = {};

        const patientData = await patientService.getPatientByData({
          id: patientIds,
        });

        if (patientData) {
          await patientData.forEach(async (patient) => {
            const patientWrapper = await MPatientWrapper(patient);
            patientApiDetails[patientWrapper.getPatientId()] =
              patientWrapper.getBasicInfo();
            userIds.push(patientWrapper.getUserId());
          });
        }

        let apiUserDetails = {};
        let apiUserRoleDetails = {};
        let providerWrapper = {};

        if (userIds.length > 1) {
          const allUserData = await userService.getUserByData({ id: userIds });
          await allUserData.forEach(async (user) => {
            apiUserDetails = await MUserWrapper(user.get());
            userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();
          });

          const allUserRolesData = await userRolesService.getByData({
            user_identity: userIds,
          });

          for (let index = 0; index < allUserRolesData.length; index++) {
            apiUserRoleDetails = await UserRolesWrapper(
              allUserRolesData[index]
            );

            const record = await userRolesService.getSingleUserRoleByData({
              id: userRoleId,
            });
            const { linked_with = "", linked_id = null } = record || {};
            if (linked_with === USER_CATEGORY.PROVIDER) {
              const providerId = linked_id;
              this.doctorProviderId = providerId;
              providerWrapper = await ProvidersWrapper(null, providerId);
              providerApiData = {
                ...providerApiData,
                [providerWrapper.getProviderId()]:
                  await providerWrapper.getAllInfo(),
              };
            }

            userRolesData[apiUserRoleDetails.getId()] =
              apiUserRoleDetails.getBasicInfo();
          }
        } else {
          apiUserDetails = await MUserWrapper(null, userId);
          userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();

          apiUserRoleDetails = await UserRolesWrapper(null, userRoleId);
          userRolesData[apiUserRoleDetails.getId()] =
            apiUserRoleDetails.getBasicInfo();

          if (apiUserRoleDetails.getLinkedId()) {
            providerWrapper = await ProvidersWrapper(
              null,
              apiUserRoleDetails.getLinkedId()
            );
            providerApiData = {
              ...providerApiData,
              [providerWrapper.getProviderId()]:
                await providerWrapper.getAllInfo(),
            };
            // providerApiData[
            //   providerWrapper.getProviderId()
            // ] = await providerWrapper.getAllInfo();
          }
          // Logger.debug("userApiData --> ", apiUserDetails.isActivated());
        }

        // treatments
        let treatmentApiDetails = {};
        const treatmentDetails = await treatmentService.getAll();
        treatmentIds = [];

        for (const treatment of treatmentDetails) {
          const treatmentWrapper = await MTreatmentWrapper(treatment);
          treatmentIds.push(treatmentWrapper.getTreatmentId());
          treatmentApiDetails[treatmentWrapper.getTreatmentId()] =
            treatmentWrapper.getBasicInfo();
        }

        // severity
        let severityApiDetails = {};
        let severityIds = [];
        const severityDetails = await severityService.getAll();

        for (const severity of severityDetails) {
          const severityWrapper = await MSeverityWrapper(severity);
          severityIds.push(severityWrapper.getSeverityId());
          severityApiDetails[severityWrapper.getSeverityId()] =
            severityWrapper.getBasicInfo();
        }

        // conditions
        let conditionApiDetails = {};
        const conditionDetails = await conditionService.getAllByData({
          id: conditionIds,
        });
        conditionIds = [];

        for (const condition of conditionDetails) {
          const conditionWrapper = await MConditionWrapper(condition);
          conditionIds.push(conditionWrapper.getConditionId());
          conditionApiDetails[conditionWrapper.getConditionId()] =
            conditionWrapper.getBasicInfo();
        }

        let permissions = [];

        if (userApiWrapper.isActivated()) {
          permissions = await userApiWrapper.getPermissions();
        }

        // speciality temp todo
        let referenceData = {};
        if (
          userCategoryApiData &&
          (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP)
        ) {
          referenceData = await userCategoryApiData.getReferenceInfo();
        }

        Logger.debug("Reference data ---> ", referenceData);

        let authData = {};

        switch (category) {
          case USER_CATEGORY.DOCTOR:
          case USER_CATEGORY.HSP:
            authData = {
              doctors: userCatApiData,
              patients: patientApiDetails,
            };
            break;
          case USER_CATEGORY.PATIENT:
            authData = {
              patients: userCatApiData,
              doctors: doctorApiDetails,
            };
            break;
          default:
            authData = {
              [`${category}s`]: userCatApiData,
              patients: patientApiDetails,
              doctors: doctorApiDetails,
            };
            break;
        }

        const dataToSend = {
          users: {
            ...userApiData,
          },
          user_roles: {
            ...userRolesData,
          },
          // [`${category}s`]: {
          //   ...userCatApiData,
          // },
          // [DOCTOR_TYPE_PROFILES.includes(category)
          //   ? "patients"
          //   : "doctors"]: DOCTOR_TYPE_PROFILES.includes(category)
          //   ? { ...patientApiDetails }
          //   : { ...doctorApiDetails },
          // [category === USER_CATEGORY.DOCTOR ? "patients" : "doctors"]:
          // category === USER_CATEGORY.DOCTOR
          //   ? { ...patientApiDetails }
          //   : { ...doctorApiDetails },
          ...authData,
          // patients: patientApiDetails,
          care_plans: {
            ...carePlanApiData,
          },
          providers: {
            ...providerApiData,
          },
          severity: {
            ...severityApiDetails,
          },
          conditions: {
            ...conditionApiDetails,
          },
          treatments: {
            ...treatmentApiDetails,
          },
          ...referenceData,
          permissions,

          severity_ids: severityIds,
          condition_ids: conditionIds,
          treatment_ids: treatmentIds,
          auth_user: userId,
          auth_category: category,
          auth_user_role: userRoleId,
          hasConsent: has_consent,
          server_constants: serverConstants,
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
          files,
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
          profile_pic: profile_pic ? getFilePath(profile_pic) : null,
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
          profile_pic: profile_pic ? getFilePath(profile_pic) : null,
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

        name = `${first_name} ${middle_name ? `${middle_name} ` : ""}${
          last_name ? `${last_name} ` : ""
        }`;

        Logger.debug(
          "MIDDLE NAME --> ",
          first_name,
          middle_name,
          last_name,
          name
        );

        city = docCity;
        profile_pic = docPic ? completePath(docPic) : docPic;
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
      registration_details = [],
    } = req.body;

    const { userDetails: { userId: user_id } = {} } = req;
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
      let qualificationsOfDoctor =
        await qualificationService.getQualificationsByDoctorId(doctor_id);

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
      const registrationsOfDoctor =
        await registrationService.getRegistrationByDoctorId(doctor_id);

      let newRegistrations = [];
      for (const item of registration_details) {
        const { number, council, year, expiry_date, id = 0 } = item;
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
            expiry_date,
          });
          console.log("REGISTRATION ITEMMMMMMMMMMMMMMMM", registration);
        }
      }

      for (let registration of registrationsOfDoctor) {
        let rId = registration.get("id");
        if (newRegistrations.includes(rId)) {
          console.log("REGISTRATION IFFFF", newRegistrations);
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

  getDoctorQualificationRegisterData = async (req, res) => {
    // let { userId } = req.params;
    try {
      const { userDetails: { userId } = {} } = req || {};
      const qualificationData = await doctorQualificationData(userId);
      console.log("FINAL+++================>", qualificationData);

      const doctor = await doctorService.getDoctorByUserId(userId);
      // let doctor_id = doctor.get("id");

      const doctorRegistrationDetails =
        await registrationService.getRegistrationByDoctorId(doctor.get("id"));

      // Logger.debug("283462843 ", doctorRegistrationDetails);

      let doctorRegistrationApiDetails = {};
      let uploadDocumentApiDetails = {};
      let upload_document_ids = [];

      for (let doctorRegistration of doctorRegistrationDetails) {
        const doctorRegistrationWrapper = await MDoctorRegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments =
          await uploadDocumentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            doctorRegistrationWrapper.getDoctorRegistrationId()
          );

        await registrationDocuments.forEach(async (document) => {
          const uploadDocumentWrapper = await MUploadDocumentWrapper(document);
          uploadDocumentApiDetails[
            uploadDocumentWrapper.getUploadDocumentId()
          ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        });

        Logger.debug(
          "76231238368126312 ",
          doctorRegistrationWrapper.getBasicInfo()
        );
        doctorRegistrationApiDetails[
          doctorRegistrationWrapper.getDoctorRegistrationId()
        ] = {
          ...doctorRegistrationWrapper.getBasicInfo(),
          upload_document_ids,
        };

        upload_document_ids = [];
      }

      Logger.debug(
        "doctorRegistrationApiDetails --> ",
        doctorRegistrationApiDetails
      );

      return this.raiseSuccess(
        res,
        200,
        {
          qualificationData,
          registration_details: {
            ...doctorRegistrationApiDetails,
          },
          upload_documents: {
            ...uploadDocumentApiDetails,
          },
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
      // let doctor_id = doctor.get("id");
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
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION;
      let parent_id = qualificationId;
      const documentToCheck = document.includes(
        process.config.minio.MINIO_BUCKET_NAME
      )
        ? getFilePath(document)
        : document;
      let documentToDelete = await documentService.getDocumentByData(
        parent_type,
        parent_id,
        documentToCheck
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
      let {
        degree = "",
        year = "",
        college = "",
        id = 0,
        photos = [],
      } = qualification || {};
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
              document: photo.includes(process.config.minio.MINIO_BUCKET_NAME)
                ? getFilePath(photo)
                : photo,
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
              document: photo.includes(process.config.minio.MINIO_BUCKET_NAME)
                ? getFilePath(photo)
                : photo,
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
        let { name = "", location = "", time_slots = [] } = item;

        const details = {
          time_slots,
        };

        let clinic = await clinicService.addClinic({
          doctor_id,
          name,
          location,
          details,
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

  addDoctorsPatient = async (req, res) => {
    const {
      mobile_number = "",
      name = "",
      gender = "",
      date_of_birth = "",
      prefix = "",
      treatment_id = "1",
      severity_id = "1",
      condition_id = "1",
    } = req.body;
    const { userId: user_id = 1 } = req.params;
    try {
      let password = process.config.DEFAULT_PASSWORD;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      let user = await userService.addUser({
        prefix,
        mobile_number,
        password: hash,
        sign_in_type: "basic",
        category: "patient",
        onboarded: false,
      });

      let newUId = user.get("id");

      const { first_name, middle_name, last_name } = getSeparateName(name);

      // let patientName = name.split(" ");
      // let first_name = patientName[0];
      // let middle_name = patientName.length == 3 ? patientName[1] : "";
      // let last_name =
      //   patientName.length == 3
      //     ? patientName[2]
      //     : patientName.length == 2
      //     ? patientName[1]
      //     : "";

      let uid = uuidv4();
      let birth_date = moment(date_of_birth);
      let age = moment().diff(birth_date, "years");
      let patient = await patientService.addPatient({
        first_name,
        gender,
        middle_name,
        last_name,
        user_id: newUId,
        birth_date,
        age,
        uid,
      });

      let doctor = await doctorService.getDoctorByUserId(user_id);
      let carePlanTemplate =
        await carePlanTemplateService.getCarePlanTemplateByData(
          treatment_id,
          severity_id,
          condition_id
        );
      const patient_id = patient.get("id");
      const doctor_id = doctor.get("id");
      const care_plan_template_id = carePlanTemplate
        ? carePlanTemplate.get("id")
        : null;

      const details = care_plan_template_id
        ? {}
        : { treatment_id, severity_id, condition_id };
      const carePlan = await carePlanService.addCarePlan({
        patient_id,
        doctor_id,
        care_plan_template_id,
        details,
        expired_on: moment(),
      });

      let carePlanNew = await carePlanService.getSingleCarePlanByData({
        patient_id,
        doctor_id,
        care_plan_template_id,
        details,
      });
      const carePlanId = carePlanNew.get("id");

      return this.raiseSuccess(
        res,
        200,
        { patient_id, carePlanId, carePlanTemplateId: care_plan_template_id },
        "doctor's patient added successfully"
      );
    } catch (error) {
      console.log("ADD DOCTOR PATIENT ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };
  uploadDoctorRegistrationDocuments = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const file = req.file;
      const { userDetails: { userId } = {} } = req;

      Logger.debug("7857257 file", file);

      let files = await uploadImageS3(userId, file);

      Logger.debug("files", files);

      return this.raiseSuccess(
        res,
        200,
        {
          files: files,
        },
        "doctor qualification updated successfully"
      );
    } catch (error) {
      Logger.debug(
        "M-API uploadDoctorRegistrationDocuments CATCH ERROR ---->",
        error
      );
      return raiseServerError(res);
    }
  };

  updateRegistrationDetails = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { body, userDetails: { userId } = {} } = req;
      const {
        gender = "",
        speciality = "",
        qualifications = [],
        registration = {},
      } = body || {};

      let doctor = await doctorService.getDoctorByUserId(userId);
      let doctor_id = doctor.get("id");

      Logger.debug("1786387131 userId", userId);
      Logger.debug("1786387131 doctor_id", doctor_id);

      if (gender && speciality) {
        let doctor_data = { gender, speciality };
        let updatedDoctor = await doctorService.updateDoctor(
          doctor_data,
          doctor_id
        );
      }

      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION;
      let parent_id = "";

      if (qualifications.length > 0) {
        for (let qualification of qualifications) {
          let {
            degree = "",
            year = "",
            college = "",
            id = 0,
            photos = [],
          } = qualification || {};
          let qualification_id = id;
          parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION;
          parent_id = qualification_id;
          // console.log("REGISTER QUALIFICATIONNNNNNNNN1111111", id,qualification_id);
          if (!qualification_id) {
            let docQualification = await qualificationService.addQualification({
              doctor_id,
              degree,
              year,
              college,
            });
            qualification_id = docQualification.get("id");

            // if(photos.length>2){
            //   return this.raiseServerError(res, 400, {}, 'cannot add more than 3 images');
            // }

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
                  document: photo.includes(
                    process.config.minio.MINIO_BUCKET_NAME
                  )
                    ? getFilePath(photo)
                    : photo,
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
                  document: photo.includes(
                    process.config.minio.MINIO_BUCKET_NAME
                  )
                    ? getFilePath(photo)
                    : photo,
                });
              }
            }
          }
        }
      }

      // REGISTRATION
      let {
        number = "",
        council = "",
        year: registration_year = "",
        expiry_date = "",
        id: registration_id = 0,
        photos: registration_photos = [],
      } = registration || {};
      parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION;
      parent_id = registration_id;

      let registrationId = registration_id;

      if (!registrationId) {
        const docRegistration = await registrationService.addRegistration({
          doctor_id,
          number,
          council,
          year: registration_year,
          expiry_date: moment(expiry_date),
        });

        registrationId = docRegistration.get("id");
        for (let photo of registration_photos) {
          let document = photo;
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            document
          );

          if (!docExist) {
            let qualificationDoc = await documentService.addDocument({
              doctor_id,
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              parent_id: docRegistration.get("id"),
              document: photo.includes(process.config.minio.MINIO_BUCKET_NAME)
                ? getFilePath(photo)
                : photo,
            });
          }
        }
      } else {
        const docRegistration = await registrationService.updateRegistration(
          {
            doctor_id,
            number,
            council,
            year: registration_year,
            expiry_date: moment(expiry_date),
          },
          registration_id
        );

        for (let photo of registration_photos) {
          let document = photo;
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            document
          );

          if (!docExist) {
            let registrationDoc = await documentService.addDocument({
              doctor_id,
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              parent_id: registration_id,
              document: photo.includes(process.config.minio.MINIO_BUCKET_NAME)
                ? getFilePath(photo)
                : photo,
            });
          }
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          registration_id: registrationId,
        },
        "registrations updated successfully"
      );
    } catch (error) {
      Logger.debug("500 error", error);
      return raiseServerError(res);
    }
  };

  deleteDoctorRegistrationDocument = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;

    try {
      const { registrationId = 0 } = req.params;
      const { document = "" } = req.body;
      const documentToCheck = document.includes(
        process.config.minio.MINIO_BUCKET_NAME
      )
        ? getFilePath(document)
        : document;
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION;
      let documentToDelete = await documentService.getDocumentByData(
        parent_type,
        registrationId,
        documentToCheck
      );

      await documentToDelete.destroy();
      return raiseSuccess(
        res,
        200,
        {},
        "doctor registration document deleted successfully"
      );
    } catch (error) {
      Logger.debug(
        "DOCTOR REGISTRATION DOCUMENT DELETE 500 ERROR ---->",
        error
      );
      return raiseServerError(res);
    }
  };

  getDoctorRegistrationData = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { userDetails: { userId } = {} } = req;

      const doctor = await doctorService.getDoctorByUserId(userId);
      // let doctor_id = doctor.get("id");

      const doctorRegistrationDetails =
        await registrationService.getRegistrationByDoctorId(doctor.get("id"));

      // Logger.debug("283462843 ", doctorRegistrationDetails);

      let doctorRegistrationApiDetails = {};
      let upload_document_ids = [];

      for (let doctorRegistration of doctorRegistrationDetails) {
        const doctorRegistrationWrapper = await MDoctorRegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments =
          await uploadDocumentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            doctorRegistrationWrapper.getDoctorRegistrationId()
          );

        await registrationDocuments.forEach(async (document) => {
          const uploadDocumentWrapper = await MUploadDocumentWrapper(document);
          uploadDocumentApiDetails[
            uploadDocumentWrapper.getUploadDocumentId()
          ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        });

        Logger.debug(
          "76231238368126312 ",
          doctorRegistrationWrapper.getBasicInfo()
        );
        doctorRegistrationApiDetails[
          doctorRegistrationWrapper.getDoctorRegistrationId()
        ] = {
          ...doctorRegistrationWrapper.getBasicInfo(),
          upload_document_ids,
        };

        upload_document_ids = [];
      }

      Logger.debug(
        "doctorRegistrationApiDetails --> ",
        doctorRegistrationApiDetails
      );

      return raiseSuccess(
        res,
        200,
        {
          doctor_registrations: {
            ...doctorRegistrationApiDetails,
          },
        },
        "doctor registration data fetched successfully"
      );
    } catch (error) {
      Logger.debug("GET DOCTOR REGISTRATION DATA 500 ERROR ---->", error);
      return raiseServerError(res);
    }
  };

  forgotPassword = async (req, res) => {
    const { raiseServerError } = this;
    try {
      const { raiseClientError, raiseSuccess } = this;
      const { email } = req.body;
      const allUsersWithEmail = await userService.getUserByData({
        email,
        category: [USER_CATEGORY.DOCTOR, USER_CATEGORY.HSP],
      });

      if (allUsersWithEmail && allUsersWithEmail.length) {
        const userExists = allUsersWithEmail[0];
        const userWrapper = await MUserWrapper(userExists.get());
        const link = uuidv4();
        const status = "verified"; //make it pending completing flow with verify permission
        // const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        // const hash = await bcrypt.hash(password, salt);

        const userVerification = UserVerificationServices.addRequest({
          user_id: userWrapper.getId(),
          request_id: link,
          status: "pending",
          type: VERIFICATION_TYPE.FORGOT_PASSWORD,
        });
        // let uId = userInfo.get("id");

        Logger.debug(
          "process.config.WEB_URL --------------->",
          process.config.WEB_URL
        );

        const emailPayload = {
          toAddress: email,
          title: "AdhereLive: Reset your password",
          templateData: {
            email,
            link: process.config.app.reset_password + link,
            host: process.config.WEB_URL,
            title: "Doctor",
            inviteCard: "",
            mainBodyText: "Thank you for requesting a password reset",
            subBodyText: "Please click below to reset your account password",
            buttonText: "Reset Password",
            contactTo: "customersupport@adhere.live",
          },
          templateName: EMAIL_TEMPLATE_NAME.FORGOT_PASSWORD,
        };

        console.log("emailPayload for reset password--->", emailPayload);
        const emailResponse = await Proxy_Sdk.execute(
          EVENTS.SEND_EMAIL,
          emailPayload
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "There is no doctor registered with this email."
        );
      }

      raiseSuccess(
        res,
        200,
        {},
        "Thanks! If there is an account associated with the email, we will send the password reset link to it"
      );
    } catch (error) {
      Logger.debug("Forgot Password - 500 Error", error);
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
        const userRole = await userRolesService.getFirstUserRole(
          linkVerificationData.getUserId()
        );
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;

        const { id: userRoleId } = userRole || {};
        const accessToken = await jwt.sign(
          {
            userRoleId,
          },
          secret,
          {
            expiresIn,
          }
        );

        return raiseSuccess(
          res,
          200,
          {
            accessToken,
            users: {
              [userData.getId()]: {
                ...userData.getBasicInfo(),
              },
            },
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
        body: { new_password, confirm_password } = {},
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
          password: hash,
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
            [updatedUser.getId()]: updatedUser.getBasicInfo(),
          },
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
            userId: linkVerificationData.getUserId(),
          },
          secret,
          {
            expiresIn,
          }
        );

        return raiseSuccess(
          res,
          200,
          {
            accessToken,
            users: {
              [userData.getId()]: {
                ...userData.getBasicInfo(),
              },
            },
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
        userDetails: { userId, userData: { category } = {} } = {},
      } = req;

      if (new_password !== confirm_password) {
        return this.raiseClientError(res, 422, {}, "Password does not match");
      }
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(new_password, salt);

      const updateUser = await userService.updateUser(
        {
          password: hash,
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
        case USER_CATEGORY.HSP:
          const hspDoctor = await doctorService.getDoctorByUserId(userId);
          const hspDoctorData = await MDoctorWrapper(hspDoctor);
          categoryData[hspDoctorData.getDoctorId()] =
            hspDoctorData.getBasicInfo();
          break;
        default:
      }

      return this.raiseSuccess(
        res,
        200,
        {
          users: {
            [updatedUser.getId()]: updatedUser.getBasicInfo(),
          },
          [`${category}s`]: {
            ...categoryData,
          },
        },
        "Password updated successfully"
      );
    } catch (error) {
      Logger.debug("updatePassword 500 error", error);
      return this.raiseServerError(res);
    }
  };

  giveConsent = async (req, res) => {
    const { raiseClientError } = this;
    try {
      const {
        userDetails: { userId, userRoleId } = {},
        body: { agreeConsent } = {},
      } = req;

      Logger.info(
        `1897389172 agreeConsent :: ${agreeConsent} | userId : ${userId}`
      );

      if (!agreeConsent) {
        return raiseClientError(
          res,
          422,
          {},
          "Cannot proceed without accepting Terms of Service"
        );
      }

      //update
      await userService.updateUser(
        {
          has_consent: agreeConsent,
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

      const appNotification = new AppNotification();

      const notificationToken = appNotification.getUserToken(`${userRoleId}`);
      const feedId = base64.encode(`${userRoleId}`);

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
        notificationToken: notificationToken,
        feedId,
        hasConsent: apiUserDetails.getConsent(),
        auth_category: apiUserDetails.getCategory(),
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
    } catch (error) {
      Logger.debug("giveConsent 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new MobileUserController();
