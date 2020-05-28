const express = require("express");
const router = express.Router();
import userRouter from "./user";
import eventRouter from "./events";
import twilioRouter from "./twilio";
import userService from "../../app/services/user/user.service";
import jwt from "jsonwebtoken";

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

        if (accessToken) {
            const secret = process.config.TOKEN_SECRET_KEY;
            const decodedAccessToken = await jwt.verify(accessToken, secret);
            let user = await userService.getUser(decodedAccessToken.userId);
            console.log("user --> 11 ", user);
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

router.use(userRouter);
router.use(eventRouter);
router.use(twilioRouter);

module.exports = router;