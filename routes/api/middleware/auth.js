const jwt = require("jsonwebtoken");
const {OAuth2Client} = require('google-auth-library');
const userService = require("../../../app/services/user/user.service");
const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../../app/controllers/helper/responseFormat");
import doRequest from "../../../app/controllers/helper/doRequest";

export default async (req, res, next) => {
    try{
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
            console.log(decodedAccessToken);
            const access_token = decodedAccessToken.accessToken;

            // we will extract the type of signIn from db, user details and accordingly verify token.
            // for now we are commenting other for testing purpose.



            // first check the accessToken if expired or active by hitting google API for google toke

            // const CLIENT_ID = process.config.GOOGLE_KEYS.CLIENT_ID;
            // const CLIENT_SECRET = process.config.GOOGLE_KEYS.CLIENT_SECRET;
            // const REDIRECT_URI = process.config.GOOGLE_KEYS.REDIRECT_URI;
            // const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
            // const userInfo =  await client.getTokenInfo(access_token);
            // console.log(userInfo);


            // now check the accessToken for facebook login
            const appToken = process.config.FACEBOOK_KEYS.APP_TOKEN;
            const link = `https://graph.facebook.com/debug_token?input_token=${access_token}&access_token=${appToken}`;

            const res = await doRequest({
                url:link,
                json:true
            });

            console.log(res);


            //now get user details
            // const user = await userService.getUser({
            // 	_id: decodedAccessToken.userId
            // });
            // if (user) {
            // 	req.userDetails = {
            // 	    exists: true,
            // 	    userId: decodedAccessToken.userId,
            // 	    userData: user
            // 	};
            // } else {
            // }
        } else {
            const response = new Response(false, 401);
            response.setError({ message: errMessage.COOKIES_NOT_SET });
            return res.status(400).json(response.getResponse());
        }
        next();
    }
    catch(err){
        console.log("errr ===== ", err);
        let payload = {};
        if(err.data.is_valid===false){
            payload = {
                code:400,
                error: "Access Token Expired"
            };
        }
        else if (err.response &&  err.response.data.error==="invalid_token"){
            payload = {
                code: 400,
                error: "Access Token Expired"
            };
        }
        else if (err.name === "TokenExpiredError") {
            payload = {
                code: 401,
                error: "session expired"
            };
        } else {
            payload = {
                code: 500,
                error: errMessage.INTERNAL_SERVER_ERROR
            };
        }

        let response = new Response(false, payload.code);
        response.setError(payload);
        return res.status(payload.code).json(response.getResponse());
    }

};
