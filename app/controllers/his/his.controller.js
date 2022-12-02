const jwt = require("jsonwebtoken");
import Log from "../../../libs/log";
// import fs from "fs";
const Response = require("../helper/responseFormat");
import userService from "../../services/user/user.service";
import Controller from "../index";

const Logger = new Log("WEB USER CONTROLLER");

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

      if (doLogin) {
        const expiresIn = "60s"; // expires in 30 day

        const secret = process.config.TOKEN_SECRET_KEY;
        const accessToken = await jwt.sign(
          {
            providerId: 2,
          },
          secret,
          {
            expiresIn,
          }
        );

        res.cookie("accessToken", accessToken, {
          expires: new Date(Date.now() + 1 * 86400000),
          httpOnly: true,
        });

        return this.raiseSuccess(
          res,
          200,
          {},
          "Initial data retrieved successfully"
        );
      } else {
        return this.raiseClientError(res, 401, {}, "Invalid Credentials");
      }
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);

      return this.raiseServerError(res);
    }
  };
}

export default new UserController();
