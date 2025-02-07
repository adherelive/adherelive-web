const express = require("express");
const router = express.Router();

import jwt from "jsonwebtoken";

import userService from "../../app/services/user/user.service";
import userRolesService from "../../app/services/userRoles/userRoles.service";

import UserWrapper from "../../app/apiWrapper/web/user";
import UserRoleWrapper from "../../app/apiWrapper/mobile/userRoles";

import { createLogger } from "../../libs/logger";
import userRouter from "./user";

import appointmentRouter from "./appointments";
import eventRouter from "./events";
import twilioRouter from "./twilio";
import patientRouter from "./patients";
import medicineRouter from "./medicines";
import medicationRouter from "./medications";
import carePlanRouter from "./carePlans";
import adminRouter from "./admin";
import chartRouter from "./graphs";
import doctorRouter from "./doctors";
import collegeRouter from "./college";
import degreeRouter from "./degree";
import councilRouter from "./council";
import conditionRouter from "./condition";
import severityRouter from "./severity";
import treatmentRouter from "./treatment";
import specialityRouter from "./speciality";
import carePlanTemplateRouter from "./carePlanTemplate";
import notificationRouter from "./notification";
import symptomRouter from "./symptoms";
import vitalRouter from "./vitals";
import accountsRouter from "./accounts";
import hisRouter from "./his";
import hisOperationRouter from "./his/his-operation";
import providersRouter from "./providers";
import featuresRouter from "./features";
import reportRouter from "./reports";
import transactionRouter from "./transactions";
import userFavourites from "./userFavourites";
import agoraRouter from "./agora";
import adhocRouter from "./adhoc";
import userRoles from "./userRoles";
import foodItemsRouter from "./foodItems";
import mealTemplateRouter from "./mealTemplate";
import dietRouter from "./diet";
import portionRouter from "./portion";
import exerciseRouter from "./exercises";
import workoutRouter from "./workouts";
import cdssRouter from "./cdss";
import serviceOfferingRouter from "./serviceOffering";
import serviceSubscriptionRouter from "./serviceSubscription";
import serviceUserMappingRouter from "./serviceUserMapping";
import serviceSubscriptionUserMapping from "./serviceSubscriptionUserMapping";
import serviceSubscribeTxRouter from "./serviceSubscribeTransaction";
import TxActivitiesRouter from "./transactionActivity";
import FlashCardRouter from "./flashCard";
import reassignAudit from "./reassignAudit";
import NotesRouter from "./notes";
import prescriptionRouter from "./prescription";

const logger = createLogger("API > INDEX");

router.use(async function (req, res, next) {
  // logger.debug("api-index-1 ---> router getTime: " + getTime() + " " + getTime());
  try {
    let accessToken,
      userId = null,
      userRoleId,
      userRoleData;
    const { cookies = {} } = req;
    // logger.debug("api-index-2" + getTime());

    /**
     * TODO: Commenting out the below, as it is not required here currently
    if (cookies.accessToken) {
      accessToken = cookies.accessToken;
    }
    logger.debug("api-index-3" + getTime());
    const { accessToken: aT = "" } = req.headers || {};
    if (aT) {
      accessToken = aT;
    }
     */
    let { m } = req.query;

    // If the 'm' is a parameter in the query, then it is a mobile request
    if (m) {
      const { authorization = "" } = req.headers || {};
      const bearer = authorization.split(" ");
      if (bearer.length === 2) {
        accessToken = bearer[1];
      }
    } else {
      const { cookies = {} } = req;
      if (cookies.accessToken) {
        accessToken = cookies.accessToken;
      }
    }

    const secret = process.config.TOKEN_SECRET_KEY;
    // logger.debug("api-index-4" + getTime());
    if (accessToken) {
      // logger.debug("api-index-5" + getTime());
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const {
        userRoleId: decodedUserRoleId = null,
        userId: decodedUserTokenUserId = null,
        his_id: his_id = null,
      } = decodedAccessToken || {};
      const userRoleDetails = await userRolesService.getSingleUserRoleByData({
        id: decodedUserRoleId,
      });

      // logger.debug("api-index-6" + getTime());
      if (userRoleDetails) {
        const userRole = await UserRoleWrapper(userRoleDetails);
        userId = userRole.getUserId();
        userRoleId = parseInt(decodedUserRoleId);
        userRoleData = userRole.getBasicInfo();
      } else {
        req.his_id = his_id;
        req.userDetails = {
          exists: false,
        };
        next();
        return;
      }
      // logger.debug("api-index-7" + getTime());
    } else {
      // logger.debug("api-index-8" + getTime());
      req.userDetails = {
        exists: false,
      };
      next();
      // logger.debug("api-index-9" + getTime());
      return;
    }
    // logger.debug("api-index-10" + getTime());
    const userData = await userService.getUser(userId);
    // logger.debug("api-index-11" + getTime());
    if (userData) {
      // logger.debug("api-index-12" + getTime());
      // logger.debug("api-index-12-1" + getTime());
      const user = await UserWrapper(userData);
      // logger.debug("api-index-12-2" + getTime());
      const { userCategoryData, userCategoryId } = (await user.getCategoryInfo()) || {};
      // logger.debug("api-index-12-3" + getTime());

      req.userDetails = {
        exists: true,
        userRoleId,
        userRoleData,
        userId,
        userData: userData.getBasicInfo,
        userCategoryData,
        userCategoryId,
      };

      // logger.debug("api-index-12-4" + getTime());
      req.permissions = await user.getPermissions();
      // logger.debug("api-index-12-5" + getTime());
      // logger.debug("api-index-13" + getTime());
      // logger.debug("api-index-14" + getTime());
    } else {
      req.userDetails = {
        exists: false,
      };
    }
    next();
  } catch (err) {
    logger.error("API index catch Error: ", err);
    req.userDetails = {
      exists: false,
    };
    next();
  }
});

// API Routes for the basic functions
router.use("/admin", adminRouter);
router.use("/appointments", appointmentRouter);
router.use("/auth", userRouter);
router.use("/auth-his", hisRouter);
router.use("/carePlans", carePlanRouter);
router.use("/charts", chartRouter);
router.use("/doctors", doctorRouter);
router.use("/events", eventRouter);
router.use("/medications", medicationRouter);
router.use("/medicines", medicineRouter);
router.use("/patients", patientRouter);
router.use("/twilio", twilioRouter);

// API Routes for the master data
router.use("/care-plan-templates", carePlanTemplateRouter);
router.use("/colleges", collegeRouter);
router.use("/conditions", conditionRouter);
router.use("/councils", councilRouter);
router.use("/degrees", degreeRouter);
router.use("/severity", severityRouter);
router.use("/specialities", specialityRouter);
router.use("/treatments", treatmentRouter);

// API Routes for the other and 3rd party functions
router.use("/accounts", accountsRouter);
router.use("/adhoc", adhocRouter);
router.use("/agora", agoraRouter);
router.use("/cdss", cdssRouter);
router.use("/diet", dietRouter);
router.use("/exercises", exerciseRouter);
router.use("/favourites", userFavourites);
router.use("/features", featuresRouter);
router.use("/flashcard", FlashCardRouter);
router.use("/food-items", foodItemsRouter);
router.use("/his", hisOperationRouter);
router.use("/meal/templates", mealTemplateRouter);
router.use("/notes", NotesRouter);
router.use("/notifications", notificationRouter);
router.use("/portions", portionRouter);
router.use("/prescription", prescriptionRouter);
router.use("/providers", providersRouter);
router.use("/reassignaudit", reassignAudit);
router.use("/reports", reportRouter);
router.use("/serviceoffering", serviceOfferingRouter);
router.use("/servicesubscription", serviceSubscriptionRouter);
router.use("/servicesubscriptionusermapping", serviceSubscriptionUserMapping);
router.use("/servicesubtx", serviceSubscribeTxRouter);
router.use("/serviceusermapping", serviceUserMappingRouter);
router.use("/symptoms", symptomRouter);
router.use("/transactions", transactionRouter);
router.use("/txactivities", TxActivitiesRouter);
router.use("/user-roles", userRoles);
router.use("/vitals", vitalRouter);
router.use("/workout", workoutRouter);

module.exports = router;
