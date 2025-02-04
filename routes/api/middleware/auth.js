import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import userService from "../../../app/services/user/user.service";
import { errMessages } from "../../../config/messages.json";
import Response from "../../../app/controllers/helper/responseFormat";
import doRequest from "../../../app/controllers/helper/doRequest";

const Authenticated = async (req, res, next) => {
  // logger.debug("auth-middle-ware - 1");
  try {
    let accessToken;
    const { query: { m } = {} } = req;

    if (m) {
      const { authorization = "" } = req.headers || {};
      const bearer = authorization.split(" ");
      if (bearer.length === 2) {
        accessToken = bearer[1];
      }
    } else {
      const { cookies = {}, headers: { accesstoken: aT = "" } = {} } = req;
      accessToken = cookies.accessToken || aT;
    }

    // logger.debug("auth-middle-ware - 2");

    if (!accessToken) {
      const response = new Response(false, 401);
      response.setError({ message: errMessages.COOKIES_NOT_SET });
      return res.status(400).json(response.getResponse());
    }

    // logger.debug("auth-middle-ware - 3");

    try {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      req.user = decodedAccessToken; // Attach decoded token to request object
      // logger.debug("auth-middle-ware - 4");
    } catch (error) {
      logger.error("Token verification failed: ", error);
      throw error;
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
        error: errMessages.INTERNAL_SERVER_ERROR,
      };
    }
    // logger.debug("auth-middle-ware - 5");
    const response = new Response(false, payload.code);
    // logger.debug("auth-middle-ware - 6");
    response.setError(payload);
    // logger.debug("auth-middle-ware - 7");
    return res.status(payload.code).json(response.getResponse());
  }
};

export default Authenticated;
