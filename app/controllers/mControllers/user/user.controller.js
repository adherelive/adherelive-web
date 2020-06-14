import * as constants from "../../../../config/constants";

const { OAuth2Client } = require("google-auth-library");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const request = require("request");
import bcrypt from "bcrypt";
import chalk from "chalk";
import {USER_CATEGORY} from "../../../../constant";

import Log from "../../../../libs/log";

const Response = require("../../helper/responseFormat");
import userService from "../../../services/user/user.service";
import patientService from "../../../services/patients/patients.service";

import MPatientWrapper from "../../../ApiWrapper/mobile/patient";
import MUserWrapper from "../../../ApiWrapper/mobile/user";

import Controller from "../../";

const Logger = new Log("MOBILE USER CONTROLLER");

class UserController extends Controller {
  constructor() {
    super();
  }

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail({
        email,
      });

      // const userDetails = user[0];
      // console.log("userDetails --> ", userDetails);
      if (!user) {
        return this.raiseClientError(res, 422, user, "user does not exists");
      }

      // TODO: UNCOMMENT below code after signup done for password check or seeder
      const passwordMatch = await bcrypt.compare(
        password,
        user.get("password")
      );
      if (passwordMatch) {
        const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            userId: user.get("id"),
          },
          secret,
          {
            expiresIn,
          }
        );

        return this.raiseSuccess(
          res,
          200,
          {
            accessToken,
          },
          "initial data retrieved successfully"
        );
      } else {
        return this.raiseClientError(res, 422, {}, "password not matching");
      }
    } catch (error) {
      console.log("error sign in  --> ", error);
      return this.raiseServerError(res, 500, error, error.getMessage());
    }
  };

  async signInGoogle(req, res) {
    const authCode = req.body.tokenId;
    const CLIENT_ID = process.config.GOOGLE_KEYS.CLIENT_ID;
    const CLIENT_SECRET = process.config.GOOGLE_KEYS.CLIENT_SECRET;
    const REDIRECT_URI = process.config.GOOGLE_KEYS.REDIRECT_URI;
    try {
      const client = new OAuth2Client(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);

      const tokens = await client.getToken(authCode);

      const idToken = tokens.tokens.id_token;
      const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: CLIENT_ID,
      });

      const accessToken = tokens.tokens.access_token;
      console.log("acess token ==== ", accessToken);

      const payload = ticket.getPayload();
      // console.log(payload);

      // create user in Db  if does not exist

      // create jwt token for cookie
      const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 1 day
      const secret = process.config.TOKEN_SECRET_KEY;
      const userId = 3;
      const accessTokenCombined = await jwt.sign(
        {
          userId: userId,
          accessToken: accessToken,
        },
        secret,
        {
          expiresIn,
        }
      );

      console.log("access token combines --> ", accessTokenCombined);

      // res.cookie("accessToken", accessTokenCombined);

      let response = new Response(true, 200);
      response.setMessage("Sign in successful!");
      response.setData({
        accessToken: accessTokenCombined,
      });
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("error ======== ", err);
      //throw err;
      let response = new Response(false, 500);
      response.setMessage("Sign in Unsuccessful!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    }
  }

  async signInFacebook(req, res) {
    const { accessToken } = req.body;

    try {
      request(
        `https://graph.facebook.com/v2.3/oauth/access_token?grant_type=fb_exchange_token&client_id=3007643415948147&client_secret=60d7c3e6dc4aae01cd9096c2749fc5c1&fb_exchange_token=${accessToken}`,
        { json: true },
        (err, res, body) => {
          if (err) {
            return console.log(err);
          }
          console.log("body ======== ", res.body.access_token);
          console.log(res.body.access_token);
        }
      );
      let response = new Response(true, 200);
      response.setMessage("Sign in successful!");
      response.setData({
        accessToken: res.body.access_token,
      });
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log(err);
      useruser;
      throw err;
    }
  }

  onAppStart = async (req, res, next) => {
    console.log(
      "--------------------CHALK-------------------",
      req.userDetails
    );
    let response;
    try {
      if (req.userDetails.exists) {
        const { userId, userData, userData: { category } = {} } = req.userDetails;
        const user = await userService.getUserById(userId);

        const userApiWrapper = await MUserWrapper(userData);

        // const userDetails = user[0];
        let userCategoryData = {};
        let userCategoryApiData = null;
        let userCategoryId = "";
        switch (category) {
          case USER_CATEGORY.PATIENT:
            userCategoryData = await patientService.getPatientByData({user_id: userId});
            userCategoryApiData = await MPatientWrapper(userCategoryData);
            userCategoryId = userCategoryApiData.getPatientId();
          default:
            userCategoryData = await patientService.getPatientByData({user_id: userId});
            userCategoryApiData = await MPatientWrapper(userCategoryData);
            userCategoryId = userCategoryApiData.getPatientId();
        }

        const dataToSend = {
          user: {
            [userId]: {
                ...userApiWrapper.getBasicInfo(),
              },
          },
          patients: {
              [userCategoryId]: {
                  ...userCategoryApiData.getBasicInfo()
              }
          }
        };

        return this.raiseSuccess(res, 200, { ...dataToSend }, "basic info");

        // response = new Response(true, 200);
        // response.setData({
        //     _id: userId,
        //     users: {
        //         [userId]: {
        //             basicInfo,
        //         }
        //     }
        // });userDetails
        // response.setMessage("Basic info");
        // return resaccessToken
        //     .status(response.getStatusCode())
        //     .send(response.getResponse());
      } else {
        throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      console.log("ON APP START API ERROR ", err);

      response = new Response(false, 500);
      response.setError(err.getMessage);
      return res.status(500).json(response.getResponse());
    }
  };

  signOut = async (req, res) => {
    try {
    } catch (error) {
      console.log("MOBILE SIGN OUT CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };
}

module.exports = new UserController();
