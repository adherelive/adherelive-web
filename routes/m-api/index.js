import UserWrapper from "../../app/apiWrapper/mobile/user";
import UserRoleWrapper from "../../app/apiWrapper/mobile/userRoles";
import mUserRouter from "./user";
import mAppointmentRouter from "./appointments";
import mEventRouter from "./events";
import mPatientRouter from "./patients";
import mDoctorRouter from "./doctors";
import mMedicineRouter from "./medicine";
import mMedicationRouter from "./medications";
import mCarePlanRouter from "./carePlans";
import chartRouter from "./graphs";

import userService from "../../app/services/user/user.service";
import userRolesService from "../../app/services/userRoles/userRoles.service";

import jwt from "jsonwebtoken";

import collegeRouter from "./college";
import degreeRouter from "./degree";
import councilRouter from "./council";
import conditionRouter from "./condition";
import severityRouter from "./severity";
import treatmentRouter from "./treatment";
import twilioRouter from "./twilio";
import specialityRouter from "./speciality";
import carePlanTemplateRouter from "./carePlanTemplate";
import notificationRouter from "./notification";
import symptomRouter from "./symptoms";
import vitalRouter from "./vitals";
import syncRouter from "./sync";
import transactionRouter from "./transactions";
import accountsRouter from "./accounts";
import featuresRouter from "./features";
import reportRouter from "./reports";
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
import mProviderRouter from "./providers";

const express = require("express");
const router = express.Router();

router.use(async (req, res, next) => {
  try {
    let accessToken,
      userId = null,
      userRoleId,
      userRoleData;
    const { authorization = "" } = req.headers || {};
    const bearer = authorization.split(" ");
    if (bearer.length === 2) {
      accessToken = bearer[1];
    }

    const secret = process.config.TOKEN_SECRET_KEY;

    if (accessToken) {
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const { userRoleId: decodedUserRoleId = null, his_id: his_id = null } =
        decodedAccessToken || {};
      const userRoleDetails = await userRolesService.getSingleUserRoleByData({
        id: decodedUserRoleId,
      });
      if (userRoleDetails) {
        const userRole = await UserRoleWrapper(userRoleDetails);
        userId = userRole.getUserId();
        userRoleId = parseInt(decodedUserRoleId);
        userRoleData = userRole.getBasicInfo();
      } else {
        req.userDetails = { exists: false, his_id };
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
    req.userDetails = {
      exists: false,
    };
    next();
  }
});

router.use("/auth", mUserRouter);
router.use("/appointments", mAppointmentRouter);
router.use("/medications", mMedicationRouter);
router.use("/events", mEventRouter);
router.use("/patients", mPatientRouter);
router.use("/doctors", mDoctorRouter);
router.use("/care-plans", mCarePlanRouter);
router.use("/medicines", mMedicineRouter);
router.use("/charts", chartRouter);
router.use("/twilio", twilioRouter);
router.use("/agora", agoraRouter);
router.use("/providers", mProviderRouter);
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
router.use("/sync", syncRouter);
router.use("/transactions", transactionRouter);
router.use("/accounts", accountsRouter);
router.use("/features", featuresRouter);
router.use("/reports", reportRouter);
router.use("/favourites", userFavourites);
router.use("/adhoc", adhocRouter);
router.use("/user-roles", userRoles);
router.use("/food-items", foodItemsRouter);
router.use("/meal/templates", mealTemplateRouter);
router.use("/diet", dietRouter);
router.use("/portions", portionRouter);
router.use("/exercises", exerciseRouter);
router.use("/workout", workoutRouter);

module.exports = router;
