const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const userService = require("../../../app/services/user/user.service");
const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../../app/controllers/helper/responseFormat");

export default async (req, res, next) => {
  try {
    let accessToken;
    const { authorization = "" } = req.headers || {};
    if (authorization) {
      const bearer = authorization.split(" ");
      if (bearer.length === 2) {
        accessToken = bearer[1];
      }
    } else {
      const { accessToken: receivedAccessToken = {} } = req.body;
      if (receivedAccessToken) {
        accessToken = receivedAccessToken;
      }
    }

    console.log("ACCESS TOKEN AUTH ---> ", accessToken);

    if (accessToken) {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const access_token = decodedAccessToken.accessToken;
    } else {
      const response = new Response(false, 401);
      response.setError({ message: errMessage.COOKIES_NOT_SET });
      return res.status(400).json(response.getResponse());
    }
    next();
  } catch (err) {
    console.log("errr ===== ", err);
    let payload = {};
    if (err.name === "TokenExpiredError") {
      payload = {
        code: 401,
        error: "session expired",
      };
    } else {
      payload = {
        code: 500,
        error: errMessage.INTERNAL_SERVER_ERROR,
      };
    }

    let response = new Response(false, payload.code);
    response.setError(payload);
    return res.status(payload.code).json(response.getResponse());
  }
};
