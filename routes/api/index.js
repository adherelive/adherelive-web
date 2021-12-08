const express = require("express");
const router = express.Router();

import jwt from "jsonwebtoken";

import userService from "../../app/services/user/user.service";
import userRolesService from "../../app/services/userRoles/userRoles.service";

import UserWrapper from "../../app/ApiWrapper/web/user";
import UserRoleWrapper from "../../app/ApiWrapper/mobile/userRoles";

import Logger from "../../libs/log";

const Log = new Logger("API > INDEX");

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

router.use(async function (req, res, next) {
  try {
    let accessToken,
      userId = null,
      userRoleId,
      userRoleData;
    const { cookies = {} } = req;
    if (cookies.accessToken) {
      accessToken = cookies.accessToken;
    }

    //  ----- FOR API TEST POSTMAN ------

    // console.log("------------ ACCESS TOKEN ---------> ", req.headers);
    const { accesstoken: aT = "" } = req.headers || {};
    if (aT) {
      accessToken = aT;
    }

    const secret = process.config.TOKEN_SECRET_KEY;

    if (accessToken) {
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const {
        userRoleId: decodedUserRoleId = null,
        userId: decodedUserTokenUserId = null,
      } = decodedAccessToken || {};
      const userRoleDetails = await userRolesService.getSingleUserRoleByData({
        id: decodedUserRoleId,
      });
      if (userRoleDetails) {
        const userRole = await UserRoleWrapper(userRoleDetails);
        userId = userRole.getUserId();
        userRoleId = parseInt(decodedUserRoleId);
        userRoleData = userRole.getBasicInfo();
      } else {
        req.userDetails = {
          exists: false,
        };
        next();
        return;
      }
    } else {
      req.userDetails = {
        exists: false,
      };
      next();
      return;
    }

    const userData = await userService.getUser(userId);
    if (userData) {
      const user = await UserWrapper(userData);
      const { userCategoryData, userCategoryId } =
        (await user.getCategoryInfo()) || {};
      req.userDetails = {
        exists: true,
        userRoleId,
        userRoleData,
        userId,
        userData: userData.getBasicInfo,
        userCategoryData,
        userCategoryId,
      };

      req.permissions = await user.getPermissions();
    } else {
      req.userDetails = {
        exists: false,
      };
    }
    next();
  } catch (err) {
    Log.debug("API INDEX CATCH ERROR ", err);
    req.userDetails = {
      exists: false,
    };
    next();
  }
});

router.use("/auth", userRouter);
router.use("/appointments", appointmentRouter);
router.use("/medications", medicationRouter);
router.use("/events", eventRouter);
router.use("/twilio", twilioRouter);
router.use("/patients", patientRouter);
router.use("/medicines", medicineRouter);
router.use("/carePlans", carePlanRouter);
router.use("/admin", adminRouter);
router.use("/charts", chartRouter);
router.use("/doctors", doctorRouter);

router.use("/colleges", collegeRouter);
router.use("/degrees", degreeRouter);
router.use("/councils", councilRouter);
router.use("/conditions", conditionRouter);
router.use("/severity", severityRouter);
router.use("/treatments", treatmentRouter);
router.use("/specialities", specialityRouter);
router.use("/care-plan-templates", carePlanTemplateRouter);

router.use("/notifications", notificationRouter);
router.use("/symptoms", symptomRouter);
router.use("/vitals", vitalRouter);
router.use("/accounts", accountsRouter);
router.use("/providers", providersRouter);
router.use("/features", featuresRouter);
router.use("/reports", reportRouter);
router.use("/transactions", transactionRouter);
router.use("/favourites", userFavourites);
router.use("/agora", agoraRouter);
router.use("/adhoc", adhocRouter);
router.use("/user-roles", userRoles);
router.use("/food-items", foodItemsRouter);
router.use("/meal/templates", mealTemplateRouter);
router.use("/diet", dietRouter);
router.use("/portions", portionRouter);
router.use("/exercises", exerciseRouter);
router.use("/workout", workoutRouter);

module.exports = router;
