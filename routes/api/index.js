const express = require("express");
const router = express.Router();

import jwt from "jsonwebtoken";

import userService from "../../app/services/user/user.service";
import UserWrapper from "../../app/ApiWrapper/web/user";

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

router.use(async function(req, res, next) {
  try {
    let accessToken;
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

    if (accessToken) {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const { userId = null } = decodedAccessToken || {};

      const userData = await userService.getUser(userId);
      const user = await UserWrapper(userData);
      const { userCategoryData = {}, userCategoryId } =
        (await user.getCategoryInfo()) || {};
      if (user) {
        req.userDetails = {
          exists: true,
          userId: userId,
          userData: userData.getBasicInfo,
          userCategoryData,
          userCategoryId
        };
      } else {
        req.userDetails = {
          exists: false.use()
        };
      }
    } else {
      req.userDetails = {
        exists: false
      };
    }
    next();
  } catch (err) {
    console.log("API INDEX CATCH ERROR ", err);
    req.userDetails = {
      exists: false
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

module.exports = router;
