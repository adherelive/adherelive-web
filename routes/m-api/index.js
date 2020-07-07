const express = require("express");
const router = express.Router();
import mUserRouter from "./user";
import mAppointmentRouter from "./appointments";
import mEventRouter from "./events";
import mPatientRouter from "./patients";
import mDoctorRouter from "./doctors";
import mMedicineRouter from "./medicine";
import mMedicationRouter from "./medications";
import mCarePlanRouter from "./carePlans";
import userService from "../../app/services/user/user.service";
import jwt from "jsonwebtoken";
// import twilioRouter from "./twilio";

router.use(async (req, res, next) => {
    try {
        const { query: { m } = {} } = req;
        let accessToken;
        if (m) {
            const { authorization = "" } = req.headers || {};
            const bearer = authorization.split(" ");
            if (bearer.length === 2) {
                accessToken = bearer[1];
            }
        }

        console.log("ACCESS TOKEN -----------------> ", accessToken);

        if (accessToken) {
            console.log("2 ACCESS TOKEN -----------------> ", accessToken);
            const secret = process.config.TOKEN_SECRET_KEY;
            const decodedAccessToken = await jwt.verify(accessToken, secret);
            console.log("3 decodedAccessToken -----------------> ", decodedAccessToken);
            let user = await userService.getUser(decodedAccessToken.userId);
            console.log("USER M-API ROUTE START ------> ", );
            if (user) {
                req.userDetails = {
                    exists: true,
                    userId: decodedAccessToken.userId,
                    userData: user
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
        console.log("89127381723 err -->", err);
        req.userDetails = {
            exists: false
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

module.exports = router;