import jwt from "jsonwebtoken";
import { OAuth2Client } from "google-auth-library";
import userService from "../../../app/services/user/user.service";
import { errMessages } from "../../../config/messages.json";
import Response from "../../../app/controllers/helper/responseFormat";
import doRequest from "../../../app/controllers/helper/doRequest";

/** This is the API being used to connect to and link the data from any HIS
 *
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
export default async (req, res, next) => {
  console.log("auth-middle-ware - 1");
  try {
    const { query: { m } = {} } = req;

    // Extract accessToken from headers, query, or cookies
    const authorization = req.headers?.authorization || "";
    const { cookies = {}, headers: { accessToken: aT = "" } = {} } = req;

    let accessToken = m
      ? authorization.split(" ")[1]
      : cookies.accessToken || aT;

    console.log("auth-middle-ware - 2");

    if (!accessToken) {
      console.log("auth-middle-ware - 3");
      const response = new Response(false, 401);
      response.setError({ message: errMessages.COOKIES_NOT_SET });
      return res.status(400).json(response.getResponse());
    }

    try {
      // const { userId = "", accessToken: access_token = "" } = decodedAccessToken || {};
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      const access_token = decodedAccessToken.accessToken;
      console.log("auth-middle-ware - 4");
    } catch (error) {
      console.error("Token verification failed: ", error);
      throw error;
    }

    next();
  } catch (err) {
    let payload = {};
    if (err.name === "TokenExpiredError") {
      payload = {
        code: 401,
        error: "Session expired",
      };
    } else {
      payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR,
      };
    }
    const response = new Response(false, payload.code);
    response.setError(payload);
    return res.status(payload.code).json(response.getResponse());
  }
};
