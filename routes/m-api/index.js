const express = require("express");
const router = express.Router();
import mUserRouter from "./user";
import mEventRouter from "./events";
import mPatientRouter from "./patients";
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

        if (accessToken) {
            const secret = process.config.TOKEN_SECRET_KEY;
            const decodedAccessToken = await jwt.verify(accessToken, secret);
            let user = await userService.getUser({ _id: decodedAccessToken.userId });
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

router.use(mUserRouter);
router.use(mEventRouter);
router.use(mPatientRouter);

module.exports = router;