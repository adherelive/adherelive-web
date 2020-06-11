const express = require("express");
const router = express.Router();
import mUserRouter from "./user";
import mEventRouter from "./events";
import mPatientRouter from "./patients";
import userService from "../../app/services/user/user.service";
import jwt from "jsonwebtoken";
// import twilioRouter from "./twilio";

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
            const { accessToken : receivedAccessToken = {} } = req.body;
            if(receivedAccessToken) {
                accessToken = receivedAccessToken;
            }
        }

        console.log("ACCESS TOKEN -----------------> ", accessToken);

        if (accessToken) {
            console.log("2 ACCESS TOKEN -----------------> ", accessToken);
            const secret = process.config.TOKEN_SECRET_KEY;
            const decodedAccessToken = await jwt.verify(accessToken, secret);
            console.log("3 decodedAccessToken -----------------> ", accessToken);
            let user = await userService.getUser(decodedAccessToken.userId);
            console.log("USER M-API ROUTE START ------> ", user);
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
        req.userDetails = {
            exists: false
        };
        next();
    }
});

router.use("/auth", mUserRouter);
router.use("/events", mEventRouter);
router.use("/patients", mPatientRouter);

module.exports = router;