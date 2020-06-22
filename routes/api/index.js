const express = require("express");
const router = express.Router();

import userRouter from "./user";
import appointmentRouter from "./appointments";
import eventRouter from "./events";
import twilioRouter from "./twilio";
import patientRouter from "./patients";
import medicineRouter from "./medicines";
import medicationRouter from "./medications";
import adminRouter from "./admin";

import userService from "../../app/services/user/user.service";
import jwt from "jsonwebtoken";
import Log from "../../libs/log";


router.use(async function(req, res, next) {
  try {
    const { query: { m } = {} } = req;
    let accessToken;
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

    //  ----- FOR API TEST POSTMAN ------

    console.log("------------ ACCESS TOKEN ---------> ", req.headers);
    const { accesstoken: aT = "" } = req.headers || {};
    if (aT) {
      accessToken = aT;
    }

    if (accessToken) {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const {userId = null} = decodedAccessToken || {};
      let user = await userService.getUser(userId);
      if (user) {
        req.userDetails = {
          exists: true,
          userId: userId,
          userData: user.getBasicInfo
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
router.use("/admin", adminRouter);

module.exports = router;
