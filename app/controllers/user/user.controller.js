const { OAuth2Client } = require("google-auth-library");
const moment = require("moment");
const jwt = require("jsonwebtoken");
const request = require("request");
const chalk = require("chalk");
import bcrypt from "bcrypt";

import Log from "../../../libs/log";

const Response = require("../helper/responseFormat");
import userService from "../../services/user/user.service";
import userWrapper from "../../ApiWrapper/user";
import UserVerificationServices from "../../services/userVerifications/userVerifications.services";
import Controller from "../";
import { v4 as uuidv4 } from "uuid";
import constants from "../../../config/constants";
import { EMAIL_TEMPLATE_NAME, USER_CATEGORY } from "../../../constant";
import { Proxy_Sdk, EVENTS } from "../../proxySdk";
// import  EVENTS from "../../proxySdk/proxyEvents";
const errMessage = require("../../../config/messages.json").errMessages;
import minioService from "../../../app/services/minio/minio.service";

class UserController extends Controller {
  constructor() {
    super();
  }

  async signUp(req, res) {
    // const errors = validationResult(req);

    // if (!errors.isEmpty()) {
    //   let response = new Response(false, 422);
    //   response.setError(
    //     Object.assign(errors.mapped(), {
    //       message: "Invalid value"
    //     })
    //   );
    //   return res.status(422).json(response.getResponse());
    // }

    try {
      const { password, email } = req.body;
      const userExits = await userService.getUserByEmail({ email });

      console.log("CREDENTIALSSSSSSSSSSSSSS", password, email);
      if (userExits !== null) {
        const userExitsError = new Error();
        userExitsError.code = 11000;
        throw userExitsError;
      }

      let response;
      const link = uuidv4();
      const status = "pending";
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      //   const eventData = {
      //     eventCategory,
      //     details: { email, password: hash },
      //     link,
      //     status
      //   };

      let user = await userService.addUser({
        email,
        password,
        sign_in_type: "basic",
        category: "doctor"
      });

      const userInfo = await userService.getUserByEmail({ email });

      const userVerification = UserVerificationServices.addRequest({
        user_id: userInfo.get("id"),
        request_id: link,
        status: "pending"
      });

      console.log(
        "CREDENTIALSSSSSSSSSSSSSS111111111111",
        "      1234567890          ",
        userInfo.get("id")
      );
      const emailPayload = {
        title: "Verification mail",
        toAddress: email,
        templateName: EMAIL_TEMPLATE_NAME.WELCOME,
        templateData: {
          title: "Doctor",
          link: process.config.app.invite_link + link,
          inviteCard: "",
          mainBodyText: "We are really happy that you chose us.",
          subBodyText: "Please verify your account",
          buttonText: "Verify",
          host: process.config.WEB_URL,
          contactTo: "nishchay.chaudhary@tripock.com"
        }
      };

      Proxy_Sdk.execute(EVENTS.SEND_EMAIL, emailPayload);

      response = new Response(true, 200);
      response.setMessage("Sign Up Successfully!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("signup err,", err);
      if (err.code && err.code == 11000) {
        let response = new Response(false, 400);
        console.log(
          "Sign ka hai -----------> , ",
          errMessage.EMAIL_ALREADY_EXISTS
        );
        response.setError(errMessage.EMAIL_ALREADY_EXISTS);
        return res.status(400).json(response.getResponse());
      } else {
        let response = new Response(false, 500);
        response.setError(errMessage.INTERNAL_SERVER_ERROR);
        return res.status(500).json(response.getResponse());
      }
    }
  }

  signIn = async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await userService.getUserByEmail({
        email
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
            userId: user.get("id")
          },
          secret,
          {
            expiresIn
          }
        );

        res.cookie("accessToken", accessToken, {
          expires: new Date(
            Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
          ),
          httpOnly: true
        });

        return this.raiseSuccess(
          res,
          200,
          {},
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
        audience: CLIENT_ID
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
          accessToken: accessToken
        },
        secret,
        {
          expiresIn
        }
      );

      console.log("access token combines --> ", accessTokenCombined);

      res.cookie("accessToken", accessTokenCombined, {
        // expires: new Date(
        //     Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
        // ),
        httpOnly: true
      });

      let response = new Response(true, 200);
      response.setMessage("Sign in successful!");
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
    console.log("111--> ", accessToken);
    try {
      request(
        `https://graph.facebook.com/v2.3/oauth/access_token?grant_type=fb_exchange_token&client_id=${process.config.FACEBOOK_KEYS.APP_TOKEN}&client_secret=${process.config.FACEBOOK_KEYS.SECRET_TOKEN}&fb_exchange_token=${accessToken}`,
        { json: true },
        async (err, response, body) => {
          if (err) {
            return console.log(err);
          }
          const { access_token = "", expires_in } = body || {};

          const expiresIn = process.config.TOKEN_EXPIRE_TIME; // expires in 1 day
          const secret = process.config.TOKEN_SECRET_KEY;
          const userId = "4"; // todo: seeder for facebook sign-in doctor

          if (access_token) {
            const accessTokenCombined = await jwt.sign(
              {
                userId: userId,
                accessToken: accessToken
              },
              secret,
              {
                expiresIn
              }
            );

            res.cookie("accessToken", accessTokenCombined, {
              // expires: new Date(
              //     Date.now() + process.config.INVITE_EXPIRE_TIME * 86400000
              // ),
              httpOnly: true
            });

            let resp = new Response(true, 200);
            resp.setData({
              users: {}
            });
            resp.setMessage("Sign in successful!");
            return res.status(resp.getStatusCode()).send(resp.getResponse());
          }
        }
      );

      // let response = new Response(true, 200);
      // response.setMessage("Sign in successful!");
      // return res
      //     .status(response.getStatusCode())
      //     .send(response.getResponse());
    } catch (err) {
      console.log("", err);
      throw err;
    }
  }

  onAppStart = async (req, res, next) => {
    let response;
    try {
      if (req.userDetails.exists) {
        const { userId, userData: { category } = {} } = req.userDetails;
        const user = await userService.getUserById(userId);

        console.log(
          "\n\n-----------USER------------------------------------",
          user,
          req.userDetails
        );

        // const userDetails = user[0];

        console.log("userId ---> ", userId);

        const apiUserDetails = new userWrapper(userId);

        let userCategoryData = {};

        // switch (category) {
        //   case USER_CATEGORY.PATIENT:
        //     userCategoryData = await patientService.getPatientByUserId(userId);
        //   default:
        //     userCategoryData = await patientService.getPatientByUserId(userId);
        // }

        const dataToSend = {
          ...await apiUserDetails.getBasicInfo()
        };

        return this.raiseSuccess(res, 200, { ...dataToSend }, "basic info");
      } else {
        console.log("userExists --->>> ", req.userDetails.exists);
        // throw new Error(constants.COOKIES_NOT_SET);
      }
    } catch (err) {
      console.log("ON APP START CATCH ERROR ", err);
      response = new Response(false, 500);
      response.setError(err.message);
      return res.status(500).json(response.getResponse());
    }
  };

  signOut = async (req, res) => {
    try {
      if (req.cookies.accessToken) {
        res.clearCookie("accessToken");

        return this.raiseSuccess(res, 200, {}, "Signed out successfully!");
      } else {
        return this.raiseServerError(res, 500, {}, constants.COOKIES_NOT_SET);
        // let response = new Response(false, 500);
        // response.setError(errMessage.INTERNAL_SERVER_ERROR);
        // return res.status(500).json(response.getResponse());
      }
    } catch (error) {
      console.log("SIGN OUT CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };

  uploadImage = async (req, res) => {
    try {
      await minioService.createBucket();
      const fileStream = fs.createReadStream(profile_pic);
      let hash = md5.create();
      hash.update(userId);
      hash.hex();
      hash = String(hash);
      const folder = "doctors";
      const file_name = hash.substring(4) + "-Report." + fileExt;
      const metaData = {
        "Content-Type":
            "application/	application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
    };
    const fileUrl = folder + "/" + file_name;
    await minioService.saveBufferObject(fileStream, fileUrl, metaData);

    console.log("file urlll: ", process.config.minio.MINI);
    let files = [fileUrl];
    return files;

    } catch (error) {
      console.log("SIGN OUT CATCH ERROR ", error);
      return this.raiseServerError(res, 500, {}, `${error.message}`);
    }
  };
}

export default new UserController();
