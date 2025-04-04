import Controller from "../index";

import base64 from "js-base64";
import bcrypt from "bcrypt";
import { createLogger } from "../../../libs/logger";

// Services
import userService from "../../services/user/user.service";
import patientService from "../../services/patients/patients.service";
import carePlanService from "../../services/carePlan/carePlan.service";
import treatmentService from "../../services/treatment/treatment.service";
import severityService from "../../services/severity/severity.service";
import conditionService from "../../services/condition/condition.service";
import providerService from "../../services/provider/provider.service";
import userRolesService from "../../services/userRoles/userRoles.service";
import doctorPatientWatchlistService from "../../services/doctorPatientWatchlist/doctorPatientWatchlist.service";
import doctorService from "../../services/doctors/doctors.service";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";

// Wrappers
import UserWrapper from "../../apiWrapper/web/user";
import DoctorWrapper from "../../apiWrapper/web/doctor";
import TreatmentWrapper from "../../apiWrapper/web/treatments";
import SeverityWrapper from "../../apiWrapper/web/severity";
import ConditionWrapper from "../../apiWrapper/web/conditions";
import ProvidersWrapper from "../../apiWrapper/web/provider";
import UserRolesWrapper from "../../apiWrapper/web/userRoles";
import DoctorPatientWatchlistWrapper from "../../apiWrapper/web/doctorPatientWatchlist";
import LinkVerificationWrapper from "../../apiWrapper/mobile/userVerification";

import { createNewUser, uploadImageS3 } from "./user.helper";
import { v4 as uuidv4 } from "uuid";
import constants from "../../../config/constants";
import { EMAIL_TEMPLATE_NAME, USER_CATEGORY, VERIFICATION_TYPE, } from "../../../constant";
import { EVENTS, Proxy_Sdk } from "../../proxySdk";

import AppNotification from "../../notificationSdk/inApp";
import AdhocJob from "../../jobSdk/Adhoc/observer";
import { getSeparateName } from "../../helper/common";

const {OAuth2Client} = require("google-auth-library");
const moment = require("moment");
const axios = require('axios');
const jwt = require('jsonwebtoken'); // Assuming you already have jwt installed
const chalk = require("chalk");

const Response = require("../helper/responseFormat");

const errMessage = require("../../../config/messages.json").errMessages;

const logger = createLogger("WEB USER CONTROLLER");

class UserController extends Controller {
  constructor() {
    super();
  }

  signUp = async (req, res) => {
    const { raiseClientError, raiseServerError, raiseSuccess } = this;
    try {
      const { body: { password, email, readTermsOfService = false } = {} } =
        req;

      if (!readTermsOfService) {
        return this.raiseClientError(
          res,
          422,
          {},
          "Please read our Terms of Service before signing up"
        );
      }

      const newUser = await createNewUser(email, password, null);

      return raiseSuccess(
        res,
        200,
        {},
        "Signed up successfully. Please check your email to proceed"
      );
    } catch (err) {
      logger.error("Signup User has an error: ", err);
      if (err.code && err.code == 11000) {
        return raiseClientError(res, 400, errMessage.EMAIL_ALREADY_EXISTS);
        // let response = new Response(false, 400);
        // response.setError(errMessage.EMAIL_ALREADY_EXISTS);
        // // response.setMessage(errMessage.EMAIL_ALREADY_EXISTS);
        // return res.status(400).json(response.getResponse());
      } else {
        return raiseServerError(res);
        // let response = new Response(false, 500);
        // response.setError(errMessage.INTERNAL_SERVER_ERROR);
        // // response.setMessage(errMessage.INTERNAL_SERVER_ERROR);
        // return res.status(500).json(response.getResponse());
      }
    }
  };

  verifyUser = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { params: { link } = {} } = req;
      logger.debug(`(axios.post)(param) LINK :: ${link}`);
      const verifications = await UserVerificationServices.getRequestByLink(
        link
      );

      const { user_id: userId } = verifications.get("") || {};

      const userData = await userService.getUserById(userId);
      const { verified: isVerified } = userData.get("") || {};

      if (!isVerified) {
        await UserVerificationServices.updateVerification(
          { status: "verified" },
          link
        );

        // let activated_on = moment();
        const user = await userService.updateUser({ verified: true }, userId);

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

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(`${userId}`);
        // const feedId = base64.encode(`${userId}`);

        const apiUserDetails = await UserWrapper(null, userId);

        const dataToSend = {
          users: {
            [apiUserDetails.getId()]: {
              ...apiUserDetails.getBasicInfo(),
            },
          },
          notificationToken: notificationToken,
          feedId: `${userId}`,
          auth_user: apiUserDetails.getId(),
          auth_category: apiUserDetails.getCategory(),
        };

        // res.redirect("/sign-in");
        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true,
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
      logger.error("verifyUser 500 error", error);
      // res.redirect("/sign-in");
      return raiseServerError(res);
    }
  };

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail({
        email,
      });

      if (!user) {
        return this.raiseClientError(res, 422, user, "Email doesn't exists");
      }

      const userRole = await userRolesService.getFirstUserRole(user.get("id"));
      if (!userRole) {
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
              password: hash,
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

        // logger.debug("notificationToken --> ", notificationToken);
        // logger.debug("feedId --> ", feedId);

        const userRef = await userService.getUserData({ id: user.get("id") });

        const apiUserDetails = await UserWrapper(userRef.get());

        let permissions = [];

        if (apiUserDetails.isActivated()) {
          permissions = await apiUserDetails.getPermissions();
        }

        const dataToSend = {
          users: {
            [apiUserDetails.getId()]: apiUserDetails.getBasicInfo(),
          },
          permissions,
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
          httpOnly: true,
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
      logger.error("User Controller signIn 500 error ---> ", error);

      // notification
      const crashJob = await AdhocJob.execute("crash", { apiName: "signIn" });
      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, crashJob.getEmailTemplate());

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

      logger.debug(
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
        auth_user_role: userRoleId,
        notificationToken: notificationToken,
        feedId,
        hasConsent: apiUserDetails.getConsent(),
        auth_category: apiUserDetails.getCategory(),
      };

      res.cookie("accessToken", accessToken, {
        expires: new Date(
          Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        ),
        httpOnly: true,
      });

      return this.raiseSuccess(
        res,
        200,
        { ...dataToSend },
        "Initial data retrieved successfully"
      );
    } catch (error) {
      logger.error("giveConsent 500 error ---> ", error);
      return this.raiseServerError(res);
    }
  };

  async signInGoogle(req, res) {
    const authCode = req.body.tokenId;
    const CLIENT_ID = process.config.google_keys.CLIENT_ID;
    const CLIENT_SECRET = process.config.google_keys.CLIENT_SECRET;
    const REDIRECT_URI = process.config.google_keys.REDIRECT_URI;
    try {
      const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

      const tokens = await client.getToken(authCode);

      const idToken = tokens.tokens.id_token;
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID,
      });

      const accessToken = tokens.tokens.access_token;

      const payload = ticket.getPayload();

      // create user in Db  if does not exist

      // create jwt token for cookie
      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 1 day
      const secret = process.config.TOKEN_SECRET_KEY;
      const userId = 3;
      const accessTokenCombined = await jwt.sign(
        {
          userId: userId,
          accessToken: accessToken,
        },
        secret,
        {
          expiresIn,
        }
      );

      res.cookie("accessToken", accessTokenCombined, {
        // expires: new Date(
        //     Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        // ),
        httpOnly: true,
      });

      let response = new Response(true, 200);
      response.setMessage("Sign in successful!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setMessage("Sign in Unsuccessful!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    }
  }

  async signInFacebook(req, res) {
    const { accessToken } = req.body;

        try {
            const clientId = process.config.facebook_keys.APP_TOKEN;
            const clientSecret = process.config.facebook_keys.SECRET_TOKEN;
            const expiresIn = process.config.TOKEN_EXPIRE_TIME;
            const secret = process.config.TOKEN_SECRET_KEY;
            const userId = "4"; // TODO: seeder for FB sign-in, replace with logic to get user ID from Facebook

            const response = await axios.get(
                `https://graph.facebook.com/v2.3/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${accessToken}`,
                {
                    // No need to set json: true as axios automatically parses JSON responses
                }
            );

            if (response.data.access_token) {
                const accessTokenCombined = jwt.sign(
                    {
                        userId,
                        accessToken: response.data.access_token,
                    },
                    secret,
                    {
                        expiresIn,
                    }
                );

                const cookieOptions = {
                    httpOnly: true,
                };

                res.cookie("accessToken", accessTokenCombined, cookieOptions);

                return res.status(200).send({
                    message: "Sign in successful!",
                    users: {}, // Assuming users object is empty for now
                });
            } else {
                logger.error("Failed to get access token from Facebook:", response.data);
                // Handle error appropriately, e.g., send error response to client
                return res.status(401).send({message: "Facebook sign-in failed"});
            }
        } catch (error) {
            logger.error("Error during Facebook login:", error);
            // Handle error appropriately, e.g., send error response to client
            return res.status(500).send({message: "Internal server error"});
        }
    }


  getTime() {
    let date_ob = new Date();
    let date = ("0" + date_ob.getDate()).slice(-2);

    // current month
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);

    // current year
    let year = date_ob.getFullYear();

    // current hours
    let hours = date_ob.getHours();

    // current minutes
    let minutes = date_ob.getMinutes();

    // current seconds
    let seconds = date_ob.getSeconds();
    return (
      year +
      "-" +
      month +
      "-" +
      date +
      " " +
      hours +
      ":" +
      minutes +
      ":" +
      seconds
    );
  }

  onAppStart = async (req, res) => {
    try {
      if (req.userDetails.exists) {
        const {
          userId,
          userRoleId,
          userData,
          userData: { category } = {},
          userCategoryData: uC = {},
        } = req.userDetails;

        // const user = await userService.getUserById(userId);

        // logger.debug("user data in request", userData);

        // const userDetails = user[0];

        const authUserDetails = await UserWrapper(userData);

        let userCategoryData = {};
        // let carePlanApiData = {};
        let userApiData = {};
        let userCaregoryApiData = {};
        let providerApiData = {};

        let userCategoryApiWrapper = null;
        let userCategoryId = null;
        // let patientIds = [];
        let userIds = [userId];
        // let carePlanData = [];

        let treatmentIds = [];
        let doctorProviderId = null;

        switch (category) {
          case USER_CATEGORY.PATIENT:
            userCategoryData = await patientService.getPatientByUserId(userId);
            break;
          case USER_CATEGORY.DOCTOR:
            userCategoryData = await doctorService.getDoctorByUserId(userId);

            if (userCategoryData) {
              userCategoryApiWrapper = await DoctorWrapper(userCategoryData);

              let watchlist_patient_ids = [];

              // code implementation after phase 1
              // const watchlistRecords =
              //   await doctorPatientWatchlistService.getAllByData({
              //     user_role_id: userRoleId,
              //   });

              // if (watchlistRecords && watchlistRecords.length) {
              //   for (let i = 0; i < watchlistRecords.length; i++) {
              //     const watchlistWrapper = await DoctorPatientWatchlistWrapper(
              //       watchlistRecords[i]
              //     );
              //     const patientId = await watchlistWrapper.getPatientId();
              //     watchlist_patient_ids.push(patientId);
              //   }
              // }

              let allInfo = {};

              allInfo = await userCategoryApiWrapper.getAllInfo();
              // code implementation after phase 1
              // delete allInfo.watchlist_patient_ids;
              // allInfo["watchlist_patient_ids"] = watchlist_patient_ids;

              userCategoryId = userCategoryApiWrapper.getDoctorId();
              userCaregoryApiData[userCategoryApiWrapper.getDoctorId()] =
                allInfo;

              const record = await userRolesService.getSingleUserRoleByData({
                id: userRoleId,
              });

              const { linked_with = "", linked_id = null } = record || {};

              if (linked_with === USER_CATEGORY.PROVIDER) {
                const providerId = linked_id;
                doctorProviderId = providerId;
                const providerWrapper = await ProvidersWrapper(
                  null,
                  providerId
                );
                providerApiData[providerId] =
                  await providerWrapper.getAllInfo();
              }
            }

            break;
          case USER_CATEGORY.HSP:
            userCategoryData = await doctorService.getDoctorByUserId(userId);

            if (userCategoryData) {
              userCategoryApiWrapper = await DoctorWrapper(userCategoryData);
              // code implementation after phase 1
              // let watchlist_patient_ids = [];
              // const watchlistRecords =
              //   await doctorPatientWatchlistService.getAllByData({
              //     user_role_id: userRoleId,
              //   });
              // if (watchlistRecords && watchlistRecords.length) {
              //   for (let i = 0; i < watchlistRecords.length; i++) {
              //     const watchlistWrapper = await DoctorPatientWatchlistWrapper(
              //       watchlistRecords[i]
              //     );
              //     const patientId = await watchlistWrapper.getPatientId();
              //     watchlist_patient_ids.push(patientId);
              //   }
              // }

              let allInfo = {};

              allInfo = await userCategoryApiWrapper.getAllInfoNew();

              // code implementation after phase 1
              // delete allInfo.watchlist_patient_ids;
              // allInfo["watchlist_patient_ids"] = watchlist_patient_ids;

              userCategoryId = userCategoryApiWrapper.getDoctorId();
              userCaregoryApiData[userCategoryApiWrapper.getDoctorId()] =
                allInfo;

              const record = await userRolesService.getSingleUserRoleByData({
                id: userRoleId,
              });
              const { linked_with = "", linked_id = null } = record || {};

              if (linked_with === USER_CATEGORY.PROVIDER) {
                const providerId = linked_id;
                doctorProviderId = providerId;
                const providerWrapper = await ProvidersWrapper(
                  null,
                  providerId
                );
                providerApiData[providerId] =
                  await providerWrapper.getAllInfo();
              }
            }
            break;
          case USER_CATEGORY.PROVIDER:
            userCategoryData = await providerService.getProviderByData({
              user_id: userId,
            });
            if (userCategoryData) {
              userCategoryApiWrapper = await ProvidersWrapper(userCategoryData);
              userCaregoryApiData[userCategoryApiWrapper.getProviderId()] =
                await userCategoryApiWrapper.getAllInfo();
            }
            break;
          default:
            userCategoryData = await doctorService.getDoctorByData({
              user_id: userId,
            });
        }

        let apiUserDetails = {};

        if (userIds.length > 1) {
          const allUserData = await userService.getUserByData({ id: userIds });
          await allUserData.forEach(async (user) => {
            apiUserDetails = await UserWrapper(user.get());
            userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();
          });
        } else {
          apiUserDetails = await UserWrapper(userData);
          userApiData[apiUserDetails.getUserId()] =
            apiUserDetails.getBasicInfo();
        }

        // treatments
        let treatmentApiDetails = {};
        const treatmentDetails = await treatmentService.getAll();
        treatmentIds = [];
        for (const treatment of treatmentDetails) {
          const treatmentWrapper = await TreatmentWrapper(treatment);
          treatmentIds.push(treatmentWrapper.getTreatmentId());
          treatmentApiDetails[treatmentWrapper.getTreatmentId()] =
            treatmentWrapper.getBasicInfo();
        }

        let permissions = [];

        if (authUserDetails.isActivated()) {
          permissions = await authUserDetails.getPermissions();
        }
        // logger.debug("permissions --> ", permissions);

        // speciality temp todo
        let referenceData = {};
        if (
          (category === USER_CATEGORY.DOCTOR ||
            category === USER_CATEGORY.HSP) &&
          userCategoryApiWrapper
        ) {
          referenceData = await userCategoryApiWrapper.getReferenceInfo();
        }

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(`${userRoleId}`);

        // firebase keys
        const firebase_keys = {
          apiKey: process.config.firebase.api_key,
          appId: process.config.firebase.app_id,
          measurementId: process.config.firebase.measurement_id,
          projectId: process.config.firebase.project_id,
        };
        let response = {
          ...referenceData,
          users: {
            ...userApiData,
          },
          [`${category}s`]: {
            ...userCaregoryApiData,
          },
          notificationToken: notificationToken,
          feedId: `${userRoleId}`,
          firebase_keys,
          treatments: {
            ...treatmentApiDetails,
          },

          permissions,
          auth_user: userId,
          auth_category: category,
          auth_role: userRoleId,
          [category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
            ? "doctor_provider_id"
            : ""]:
            category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
              ? doctorProviderId
              : "",
        };

        if (category !== USER_CATEGORY.PROVIDER) {
          response = { ...response, ...{ providers: { ...providerApiData } } };
        }

        return this.raiseSuccess(res, 200, response, "basic info");
      } else {
        logger.debug("userExists ");
        // throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      logger.error("On App Start has an error: ", err);
      return this.raiseServerError(res);
    }
  };

  onAppStartBackup = async (req, res) => {
    try {
      if (req.userDetails.exists) {
        const {
          userId,
          userRoleId,
          userData,
          userData: { category } = {},
          userCategoryData: uC = {},
        } = req.userDetails;

        const authUserDetails = await UserWrapper(userData);

        let userCategoryData = {};
        // let carePlanApiData = {};
        let userApiData = {};
        let userCaregoryApiData = {};
        let providerApiData = {};

        let userCategoryApiWrapper = null;
        let userCategoryId = null;
        // let patientIds = [];
        let userIds = [userId];
        // let carePlanData = [];

        let treatmentIds = [];
        let conditionIds = [];
        let doctorProviderId = null;

        switch (category) {
          case USER_CATEGORY.PATIENT:
            userCategoryData = await patientService.getPatientByUserId(userId);
            break;
          case USER_CATEGORY.DOCTOR:
            userCategoryData = await doctorService.getDoctorByUserId(userId);
            if (userCategoryData) {
              userCategoryApiWrapper = await DoctorWrapper(userCategoryData);

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
              allInfo = await userCategoryApiWrapper.getAllInfo();
              delete allInfo.watchlist_patient_ids;
              allInfo["watchlist_patient_ids"] = watchlist_patient_ids;

              userCategoryId = userCategoryApiWrapper.getDoctorId();
              userCaregoryApiData[userCategoryApiWrapper.getDoctorId()] =
                allInfo;

              const record = await userRolesService.getSingleUserRoleByData({
                id: userRoleId,
              });
              const { linked_with = "", linked_id = null } = record || {};
              if (linked_with === USER_CATEGORY.PROVIDER) {
                const providerId = linked_id;
                doctorProviderId = providerId;
                const providerWrapper = await ProvidersWrapper(
                  null,
                  providerId
                );
                providerApiData[providerId] =
                  await providerWrapper.getAllInfo();
              }
            }
            break;
          case USER_CATEGORY.HSP:
            userCategoryData = await doctorService.getDoctorByUserId(userId);
            if (userCategoryData) {
              userCategoryApiWrapper = await DoctorWrapper(userCategoryData);

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
              allInfo = await userCategoryApiWrapper.getAllInfo();
              delete allInfo.watchlist_patient_ids;
              allInfo["watchlist_patient_ids"] = watchlist_patient_ids;

              userCategoryId = userCategoryApiWrapper.getDoctorId();
              userCaregoryApiData[userCategoryApiWrapper.getDoctorId()] =
                allInfo;

              const record = await userRolesService.getSingleUserRoleByData({
                id: userRoleId,
              });
              const { linked_with = "", linked_id = null } = record || {};
              if (linked_with === USER_CATEGORY.PROVIDER) {
                const providerId = linked_id;
                doctorProviderId = providerId;
                const providerWrapper = await ProvidersWrapper(
                  null,
                  providerId
                );
                providerApiData[providerId] =
                  await providerWrapper.getAllInfo();
              }
            }
            break;
          case USER_CATEGORY.PROVIDER:
            userCategoryData = await providerService.getProviderByData({
              user_id: userId,
            });
            if (userCategoryData) {
              userCategoryApiWrapper = await ProvidersWrapper(userCategoryData);
              userCaregoryApiData[userCategoryApiWrapper.getProviderId()] =
                await userCategoryApiWrapper.getAllInfo();
            }
            break;
          default:
            userCategoryData = await doctorService.getDoctorByData({
              user_id: userId,
            });
        }

        let apiUserDetails = {};

        if (userIds.length > 1) {
          const allUserData = await userService.getUserByData({ id: userIds });
          await allUserData.forEach(async (user) => {
            apiUserDetails = await UserWrapper(user.get());
            userApiData[apiUserDetails.getId()] = apiUserDetails.getBasicInfo();
          });
        } else {
          apiUserDetails = await UserWrapper(userData);
          userApiData[apiUserDetails.getUserId()] =
            apiUserDetails.getBasicInfo();
        }

        // treatments
        let treatmentApiDetails = {};
        const treatmentDetails = await treatmentService.getAll();
        treatmentIds = [];
        for (const treatment of treatmentDetails) {
          const treatmentWrapper = await TreatmentWrapper(treatment);
          treatmentIds.push(treatmentWrapper.getTreatmentId());
          treatmentApiDetails[treatmentWrapper.getTreatmentId()] =
            treatmentWrapper.getBasicInfo();
        }

        // severity
        let severityApiDetails = {};
        let severityIds = [];
        const severityDetails = await severityService.getAll();

        for (const severity of severityDetails) {
          const severityWrapper = await SeverityWrapper(severity);
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
          const conditionWrapper = await ConditionWrapper(condition);
          conditionIds.push(conditionWrapper.getConditionId());
          conditionApiDetails[conditionWrapper.getConditionId()] =
            conditionWrapper.getBasicInfo();
        }

        let permissions = [];

        if (authUserDetails.isActivated()) {
          permissions = await authUserDetails.getPermissions();
        }
        // logger.debug("permissions --> ", permissions);

        // speciality temp todo
        let referenceData = {};
        if (
          (category === USER_CATEGORY.DOCTOR ||
            category === USER_CATEGORY.HSP) &&
          userCategoryApiWrapper
        ) {
          referenceData = await userCategoryApiWrapper.getReferenceInfo();
        }

        const appNotification = new AppNotification();

        const notificationToken = appNotification.getUserToken(`${userRoleId}`);

        // firebase keys
        const firebase_keys = {
          apiKey: process.config.firebase.api_key,
          appId: process.config.firebase.app_id,
          measurementId: process.config.firebase.measurement_id,
          projectId: process.config.firebase.project_id,
        };

        let response = {
          ...referenceData,
          users: {
            ...userApiData,
          },
          [`${category}s`]: {
            ...userCaregoryApiData,
          },
          // patients: {
          //   ...patientApiDetails,
          // },
          // care_plans: {
          //   ...carePlanApiData,
          // },
          notificationToken: notificationToken,
          feedId: `${userRoleId}`,
          firebase_keys,
          severity: {
            ...severityApiDetails,
          },
          treatments: {
            ...treatmentApiDetails,
          },
          conditions: {
            ...conditionApiDetails,
          },
          permissions,
          severity_ids: severityIds,
          treatment_ids: treatmentIds,
          condition_ids: conditionIds,
          auth_user: userId,
          auth_category: category,
          auth_role: userRoleId,
          [category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
            ? "doctor_provider_id"
            : ""]:
            category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
              ? doctorProviderId
              : "",
        };

        if (category !== USER_CATEGORY.PROVIDER) {
          response = { ...response, ...{ providers: { ...providerApiData } } };
        }

        return this.raiseSuccess(res, 200, response, "basic info");
      } else {
        logger.debug("userExists ");
        // throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      logger.error("On App Start backup has an error", err);
      return this.raiseServerError(res);
    }
  };

  /**
   * This function handles the user logout and is linked to the /sign-out API
   * Need to ensure that all cookies and sessions are destroyed
   *
   * @param req
   * @param res
   * @returns {Promise<*>}
   */
  signOut = async (req, res) => {
    try {
      if (req.cookies.accessToken) {
        res.clearCookie("accessToken");
        return this.raiseSuccess(res, 200, {}, "Signed out successfully!");
      } else {
        return this.raiseServerError(res, 500, {}, constants.COOKIES_NOT_SET);
        /**
         * TODO: Check why these are not used?
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
         */
      }
    } catch (error) {
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  uploadImage = async (req, res) => {
    const { userDetails, body } = req;
    const { userId = "3" } = userDetails || {};
    const file = req.file;

    const { type } = body || {};

    logger.debug("file", file);
    // const fileExt= file.originalname.replace(/\s+/g, '');
    try {
      let files = await uploadImageS3(userId, file, type);
      return this.raiseSuccess(
        res,
        200,
        {
          files: files,
        },
        "files uploaded successfully"
      );
    } catch (error) {
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  doctorProfileRegister = async (req, res) => {
    const { userDetails: { userId: user_id } = {} } = req;
    let { name, city, category, mobile_number, prefix, profile_pic } = req.body;
    let doctorName = name.split(" ");
    // const { userId: user_id } = req.params;

    logger.debug("POST DOCTOR REGISTER --> ", user_id, req.params, req.body);
    try {
      let user = await userService.getUserById(user_id);
      let user_data_to_update = {
        category,
        mobile_number,
        prefix,
        onboarding_status: ONBOARDING_STATUS.PROFILE_REGISTERED,
      };

      let doctor = {};

      let doctorExist = await doctorService.getDoctorByUserId(user_id);

      logger.debug("POST DOCTOR REGISTER --> ", user_id, doctorExist);

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

      logger.debug("userId ---> ", req);

      let user = await userService.getUserById(userId);

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

      if (doctor) {
        let docInfo = doctor.getBasicInfo;
        const {
          first_name = "",
          middle_name = "",
          last_name = "",
          city: docCity = "",
          profile_pic: docPic = "",
        } = docInfo || {};

        logger.debug(
          "MIDDLE NAME --> ",
          first_name,
          middle_name,
          last_name,
          name
        );

        name = `${first_name} ${middle_name ? `${middle_name} ` : ""}${
          last_name ? `${last_name} ` : ""
        }`;

        city = docCity;
        profile_pic = docPic ? completePath(docPic) : null;
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

      return this.raiseSuccess(
        res,
        200,
        {
          profileData,
        },
        " get doctor profile successfull"
      );
    } catch (error) {
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  doctorQualificationRegister = async (req, res) => {
    let {
      speciality = "",
      gender = "",
      qualification_details = [],
      registration_details = [],
    } = req.body;

    const { userDetails: { userId: user_id } = {} } = req || {};
    try {
      let user = userService.getUserById(user_id);
      let user_data_to_update = {
        onboarding_status: ONBOARDING_STATUS.QUALIFICATION_REGISTERED,
      };
      let doctor = await doctorService.getDoctorByUserId(user_id);
      let doctor_id = doctor.get("id");
      let doctor_data = {
        gender,
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
        }
      }

      for (let qualification of qualificationsOfDoctor) {
        let qId = qualification.get("id");
        if (newQualifications.includes(qId)) {
          logger.debug("QUALIFICATIONS IFFFF");
        } else {
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

        if (id && id !== 0) {
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
        }
      }

      for (let registration of registrationsOfDoctor) {
        let rId = registration.get("id");
        if (newRegistrations.includes(rId)) {
          logger.debug("REGISTRATION IFFFF");
        } else {
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
      return this.raiseServerError(res, 500, {}, `${error.message}`);
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

      let doctorRegistrationApiDetails = {};
      let uploadDocumentApiDetails = {};
      let upload_document_ids = [];

      await doctorRegistrationDetails.forEach(async (doctorRegistration) => {
        const doctorRegistrationWrapper = await DoctorRegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments =
          await documentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            doctorRegistrationWrapper.getDoctorRegistrationId()
          );

        await registrationDocuments.forEach(async (document) => {
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
          upload_document_ids,
        };

        upload_document_ids = [];
      });

      return raiseSuccess(
        res,
        200,
        {
          doctor_registrations: {
            ...doctorRegistrationApiDetails,
          },
          upload_documents: {
            ...uploadDocumentApiDetails,
          },
        },
        "doctor registration data fetched successfully"
      );
    } catch (error) {
      logger.error("GET DOCTOR REGISTRATION DATA 500 ERROR ---> ", error);
      return raiseServerError(res);
    }
  };

  getDoctorQualificationRegisterData = async (req, res) => {
    const { userDetails: { userId } = {} } = req || {};
    try {
      const qualificationData = await doctorQualificationData(userId);

      const doctor = await doctorService.getDoctorByUserId(userId);
      // let doctor_id = doctor.get("id");

      const doctorRegistrationDetails =
        await registrationService.getRegistrationByDoctorId(doctor.get("id"));

      // logger.debug("283462843 ", doctorRegistrationDetails);

      let doctorRegistrationApiDetails = {};
      let uploadDocumentApiDetails = {};
      let upload_document_ids = [];

      for (let doctorRegistration of doctorRegistrationDetails) {
        const doctorRegistrationWrapper = await DoctorRegistrationWrapper(
          doctorRegistration
        );

        const registrationDocuments =
          await uploadDocumentService.getDoctorQualificationDocuments(
            DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            doctorRegistrationWrapper.getDoctorRegistrationId()
          );

        await registrationDocuments.forEach(async (document) => {
          const uploadDocumentWrapper = await UploadDocumentWrapper(document);
          uploadDocumentApiDetails[
            uploadDocumentWrapper.getUploadDocumentId()
          ] = uploadDocumentWrapper.getBasicInfo();
          upload_document_ids.push(uploadDocumentWrapper.getUploadDocumentId());
        });

        logger.debug(
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

      logger.debug(
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

      logger.debug("files", files);

      return this.raiseSuccess(
        res,
        200,
        {
          files: files,
        },
        "doctor qualification updated successfully"
      );
    } catch (error) {
      logger.debug(
        "uploadDoctorRegistrationDocuments CATCH ERROR ---> ",
        error
      );
      return raiseServerError(res);
    }
  };

  uploadDoctorQualificationDocument = async (req, res) => {
    const file = req.file;
    const { userDetails: { userId } = {} } = req;
    let { qualification = {} } = req.body;

    try {
      let files = await uploadImageS3(userId, file);
      let qualification_id = 0;
      let doctor = await doctorService.getDoctorByUserId(userId);
      let doctor_id = doctor.get("id");

      logger.debug("files", files);
      return this.raiseSuccess(
        res,
        200,
        {
          files: files,
        },
        "doctor qualification updated successfully"
      );
    } catch (error) {
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  deleteDoctorRegistrationDocument = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;

    try {
      const { registrationId = 0 } = req.params;
      const { document = "" } = req.body;
      // const documentToCheck = document.includes(process.config.s3.BUCKET_NAME) ? document.split(process.config.s3.BUCKET_NAME)[1] : document;
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION;
      let parent_id = registrationId;

      let documentToDelete = await documentService.getDocumentByData(
        parent_type,
        parent_id,
        document.includes(process.config.s3.BUCKET_NAME)
          ? getFilePath(document)
          : document
      );
      await documentToDelete.destroy();
      return raiseSuccess(
        res,
        200,
        {},
        "doctor registration document deleted successfully"
      );
    } catch (error) {
      logger.debug(
        "DOCTOR REGISTRATION DOCUMENT DELETE 500 ERROR ---> ",
        error
      );
      return raiseServerError(res);
    }
  };

  deleteDoctorQualificationDocument = async (req, res) => {
    const { qualificationId = 1 } = req.params;
    let { document = "" } = req.body;
    try {
      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION;
      let parent_id = qualificationId;
      let documentToDelete = await documentService.getDocumentByData(
        parent_type,
        parent_id,
        document.includes(process.config.s3.BUCKET_NAME)
          ? getFilePath(document)
          : document
      );

      await documentToDelete.destroy();
      return this.raiseSuccess(
        res,
        200,
        {},
        "doctor qualification doc deleted successfully"
      );
    } catch (error) {
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  updateRegistrationDetails = async (req, res) => {
    const { raiseServerError, raiseSuccess } = this;
    try {
      const { body, userDetails: { userId } = {} } = req;
      let {
        gender = "",
        speciality = "",
        qualification_details = [],
        registration = {},
      } = body || {};

      let doctor = await doctorService.getDoctorByUserId(userId);
      let doctor_id = doctor.get("id");

      logger.debug("doctor id ---128371 -> ", doctor_id);

      if (gender && speciality) {
        let doctor_data = { gender, speciality };
        let updatedDoctor = await doctorService.updateDoctor(
          doctor_data,
          doctor_id
        );
      }

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
        }
      }

      for (let qualification of qualificationsOfDoctor) {
        let qId = qualification.get("id");
        if (newQualifications.includes(qId)) {
          logger.debug("QUALIFICATIONS IFFFF", newQualifications);
        } else {
          let deleteDocs = await documentService.deleteDocumentsOfQualification(
            DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            qId
          );
          let quali = await qualificationService.getQualificationById(qId);
          quali.destroy();
        }
      }

      let {
        number = "",
        council = "",
        year: registration_year = "",
        expiryDate: expiry_date = "",
        id: registration_id = 0,
        photos: registration_photos = [],
      } = registration || {};

      let parent_type = DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION;
      let parent_id = registration_id;

      if (!registration_id) {
        if (registration_photos.length > 3) {
          return this.raiseServerError(
            res,
            422,
            "cannot add more than 3 images"
          );
        }
        let docRegistration = await registrationService.addRegistration({
          doctor_id,
          number,
          council,
          year: registration_year,
          expiry_date,
        });
        registration_id = docRegistration.get("id");
        for (let photo of registration_photos) {
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            photo.includes(process.config.s3.BUCKET_NAME)
              ? getFilePath(photo)
              : photo
          );

          if (!docExist) {
            let qualificationDoc = await documentService.addDocument({
              doctor_id,
              parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
              parent_id: docRegistration.get("id"),
              document: photo.includes(process.config.s3.BUCKET_NAME)
                ? getFilePath(photo)
                : photo,
            });
          }
        }
      } else {
        let doctorDocs = await documentService.getDoctorQualificationDocuments(
          parent_type,
          parent_id
        ); //registration documents because
        //parent type is registration

        let documentsToAdd = [];

        for (let photo of registration_photos) {
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            photo.includes(process.config.s3.BUCKET_NAME)
              ? getFilePath(photo)
              : photo
          );

          if (!docExist) {
            documentsToAdd.push(photo);
          }
        }

        if (documentsToAdd.length > 3) {
          return this.raiseServerError(
            res,
            422,
            "cannot add more than 3 images"
          );
        }

        if (doctorDocs.length + documentsToAdd.length > 3) {
          return this.raiseServerError(
            res,
            422,
            "cannot add more than 3 images"
          );
        }
        for (let photo of documentsToAdd) {
          let document = photo;
          let registrationDoc = await documentService.addDocument({
            doctor_id,
            parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_REGISTRATION,
            parent_id: registration_id,
            document: photo.includes(process.config.s3.BUCKET_NAME)
              ? getFilePath(photo)
              : photo,
            // .includes(process.config.s3.BUCKET_NAME) ? photo.split(process.config.s3.BUCKET_NAME)[1] : photo,
          });
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          registration_id,
        },
        "registrations updated successfully"
      );
    } catch (error) {
      return raiseServerError(res);
    }
  };

  registerQualification = async (req, res) => {
    let { gender = "", speciality = "", qualification = {} } = req.body;
    const { userDetails: { userId } = {} } = req;
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
      if (!qualification_id) {
        if (photos.length > 3) {
          return this.raiseServerError(
            res,
            422,
            "cannot add more than 3 images"
          );
        }

        let docQualification = await qualificationService.addQualification({
          doctor_id,
          degree,
          year,
          college,
        });
        qualification_id = docQualification.get("id");

        for (let photo of photos) {
          let document = photo.includes(process.config.s3.BUCKET_NAME)
            ? getFilePath(photo)
            : photo;
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
              document: photo.includes(process.config.s3.BUCKET_NAME)
                ? getFilePath(photo)
                : photo,
            });
          }
        }
      } else {
        let doctorDocs = await documentService.getDoctorQualificationDocuments(
          parent_type,
          parent_id
        );

        let documentsToAdd = [];

        for (let photo of photos) {
          let docExist = await documentService.getDocumentByData(
            parent_type,
            parent_id,
            photo.includes(process.config.s3.BUCKET_NAME)
              ? getFilePath(photo)
              : photo
          );

          if (!docExist) {
            documentsToAdd.push(photo);
          }
        }
        if (documentsToAdd.length > 3) {
          return this.raiseServerError(
            res,
            422,
            "cannot add more than 3 images"
          );
        }

        if (doctorDocs.length + documentsToAdd.length > 3) {
          return this.raiseServerError(
            res,
            422,
            "cannot add more than 3 images"
          );
        }
        for (let photo of documentsToAdd) {
          let qualificationDoc = await documentService.addDocument({
            doctor_id,
            parent_type: DOCUMENT_PARENT_TYPE.DOCTOR_QUALIFICATION,
            parent_id: qualification_id,
            document: photo.includes(process.config.s3.BUCKET_NAME)
              ? getFilePath(photo)
              : photo,
          });
        }
      }

      return this.raiseSuccess(
        res,
        200,
        {
          qualification_id,
        },
        "qualifications updated successfully"
      );
    } catch (error) {
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
            ...CLINIC_TIME_SLOTS,
          },
        },
        "clinic time slots fetched successfully"
      );
    } catch (error) {
      logger.error("getTimeSlots 500 error---> ", error);
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
      clinics.forEach(async (item) => {
        let newItem = item;
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
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };
  addDoctorsPatient = async (req, res) => {
    const {
      mobile_number = "",
      name = "",
      gender = "",
      date_of_birth = "",
      treatment: type = "",
      severity = "",
      condition = "",
      prefix = "",
      treatment_id = "1",
      severity_id = "1",
      condition_id = "1",
    } = req.body;
    // const{userId:user_id=1}=req.params;
    const { userDetails: { userId: user_id } = {} } = req;
    try {
      let password = process.config.DEFAULT_PASSWORD;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));

      logger.debug("89312793812 ---> ", password, salt);
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

      logger.debug(
        "Get Doctor ID's being used ---> ",
        doctor,
        doctor.get("id"),
        doctor_id
      );
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
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  forgotPassword = async (req, res) => {
    const { raiseServerError } = this;
    try {
      const { raiseClientError, raiseSuccess } = this;
      const { email } = req.body;
      const userExists = await userService.getUserByEmail({
        email,
      });

      if (userExists) {
        const userWrapper = await UserWrapper(userExists.get());
        const link = uuidv4();

        const userVerification = UserVerificationServices.addRequest({
          user_id: userWrapper.getId(),
          request_id: link,
          status: "pending",
          type: VERIFICATION_TYPE.FORGOT_PASSWORD,
        });

        logger.debug(
          "forgotPassword User Controller Web URL ---> ",
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

        const emailResponse = await Proxy_Sdk.execute(
          EVENTS.SEND_EMAIL,
          emailPayload
        );
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "User does not exist for the provided e-mail"
        );
      }

      raiseSuccess(
        res,
        200,
        {},
        "Thank You! If there is an account associated with the given e-mail, we will send the password reset link to it"
      );
    } catch (error) {
      logger.error("Forgot Password - 500 Error: ", error);
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

        const userRole = await userRolesService.getFirstUserRole(
          linkVerificationData.getUserId()
        );

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

        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true,
        });

        return raiseSuccess(
          res,
          200,
          {
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
      logger.error("updateUserPassword 500 error", error);
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
      logger.debug("User ID being used ---> ", user);
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
      logger.error("updateUserPassword 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new UserController();
