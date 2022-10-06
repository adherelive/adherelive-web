const jwt = require("jsonwebtoken");
const { OAuth2Client } = require("google-auth-library");
const userService = require("../../../app/services/user/user.service");
const errMessage = require("../../../config/messages.json").errMessages;
const Response = require("../../../app/controllers/helper/responseFormat");
import doRequest from "../../../app/controllers/helper/doRequest";

export default async (req, res, next) => {
  console.log("auth-middle-ware - 1");
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
    console.log("auth-middle-ware - 2");
    const { accesstoken: aT = "" } = req.headers || {};
    if (aT) {
      accessToken = aT;
    }
    console.log("auth-middle-ware - 3");
    if (accessToken) {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const { userId = "", accessToken: access_token = "" } =
        decodedAccessToken || {};
      console.log("auth-middle-ware - 4");
    } else {
      const response = new Response(false, 401);
      response.setError({ message: errMessage.COOKIES_NOT_SET });
      return res.status(400).json(response.getResponse());
    }
    next();
  } catch (err) {
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
    console.log("auth-middle-ware - 5");
    let response = new Response(false, payload.code);
    console.log("auth-middle-ware - 6");
    response.setError(payload);
    console.log("auth-middle-ware - 7");
    return res.status(payload.code).json(response.getResponse());
  }
};
