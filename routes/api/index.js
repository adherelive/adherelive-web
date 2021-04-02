const express = require("express");
const router = express.Router();

import jwt from "jsonwebtoken";

import userService from "../../app/services/user/user.service";
import profileService from "../../app/services/profiles/profiles.service";

import UserWrapper from "../../app/ApiWrapper/web/user";
import ProfileWrapper from "../../app/ApiWrapper/mobile/profile";

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

router.use(async function(req, res, next) {
  try {
    let accessToken, userAccessToken, userId = null, profileId, profileData;
    const { cookies = {} } = req;
    if (cookies.accessToken) {
      accessToken = cookies.accessToken;
    }

    //  ----- FOR API TEST POSTMAN ------

    // console.log("------------ ACCESS TOKEN ---------> ", req.headers);
    const { accesstoken: aT = "", user_identification_token = "" } = req.headers || {};
    if (aT) {
      accessToken = aT;
      userAccessToken = user_identification_token
    }

    const secret = process.config.TOKEN_SECRET_KEY;

    if(userAccessToken) {
      const decodedUserToken = await jwt.verify(userAccessToken, secret);
      const { userId: userTokenUserId = null } = decodedUserToken || {};
      userId = userTokenUserId;
    } else if (accessToken) {
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const { profileId: decodedProfileId = null } = decodedAccessToken || {};
      const profileDetails = await profileService.getProfileById(decodedProfileId);
      if(profileDetails) {
        const profile = await ProfileWrapper(profileDetails);
        userId = profile.getUserId();
        profileId = decodedProfileId;
        profileData = profile.getBasicInfo();
      } else {
        req.userDetails = {
          exists: false
        };
        next();
      }
    } else {
      req.userDetails = {
        exists: false
      };
      next();
    }

    const userData = await userService.getUser(userId);
    if (userData) {
      const user = await UserWrapper(userData);
      const { userCategoryData, userCategoryId } =
        (await user.getCategoryInfo()) || {};
      req.userDetails = {
        exists: true,
        profileId,
        profileData,
        userId,
        userData: userData.getBasicInfo,
        userCategoryData,
        userCategoryId
      };
    } else {
      req.userDetails = {
        exists: false
      };
    }
    next();
  } catch (err) {
    Log.debug("API INDEX CATCH ERROR ", err);
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
router.use("/favourites",userFavourites);
router.use("/agora", agoraRouter);
router.use("/adhoc", adhocRouter);

module.exports = router;
