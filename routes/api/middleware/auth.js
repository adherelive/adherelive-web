import jwt from "jsonwebtoken";
import { errMessages } from "../../../config/messages.json";
import Response from "../../../app/controllers/helper/responseFormat";

const Authenticated = async (req, res, next) => {
  console.log("auth-middle-ware - 1");
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

    console.log("auth-middle-ware - 2");

    if (!accessToken) {
      const response = new Response(false, 401);
      response.setError({ message: errMessages.COOKIES_NOT_SET });
      return res.status(400).json(response.getResponse());
    }

    console.log("auth-middle-ware - 3");

    try {
      const secret = process.config.TOKEN_SECRET_KEY;
      const decodedAccessToken = await jwt.verify(accessToken, secret);
      req.user = decodedAccessToken; // Attach decoded token to request object
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
        error: "session expired",
      };
    } else {
      payload = {
        code: 500,
        error: errMessages.INTERNAL_SERVER_ERROR,
      };
    }
    console.log("auth-middle-ware - 5");
    const response = new Response(false, payload.code);
    console.log("auth-middle-ware - 6");
    response.setError(payload);
    console.log("auth-middle-ware - 7");
    return res.status(payload.code).json(response.getResponse());
  }
};

export default Authenticated;
