/**
 * @author Gaurav Sharma
 * @email gaurav6421@gmail.com
 * @create date 2023-01-02 09:57:39
 * @modify date 2023-02-20 12:04:21
 * @desc a controller for his.
 */

const jwt = require("jsonwebtoken");
import Log from "../../../libs/log";
const Response = require("../helper/responseFormat");
import hisService from "../../services/his/his.service";
import Controller from "../index";
import bcrypt from "bcrypt";

const Logger = new Log("WEB USER CONTROLLER");

class HisController extends Controller {
  constructor() {
    super();
  }

  createHis = async (req, res) => {
    const data = req.body;

    if (
      data.his_password === "" ||
      data.his_password === null ||
      data.his_password === undefined
    ) {
      return this.raiseServerError(
        res,
        500,
        {},
        `Password Cannot be null or undefined.`
      );
    }
    try {
      const password = data.his_password;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      let client_secret_hash = "";
      if (data.his_client_secret) {
        const client_secret = data.his_client_secret;
        const client_secret_salt = await bcrypt.genSalt(
          Number(process.config.saltRounds)
        );
        client_secret_hash = await bcrypt.hash(
          client_secret,
          client_secret_salt
        );
      }

      console.log({ hash, data: req.body });
      let his = await hisService.createHis({
        ...data,
        his_password: hash,
        his_client_secret: client_secret_hash,
      });
      return this.raiseSuccess(res, 200, { his }, "His added successfully");
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };

  listAllHis = async (req, res) => {
    try {
      let his = await hisService.getAllHis();
      return this.raiseSuccess(res, 200, { his }, "Data retrived successfully");
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };

  getHisById = async (req, res) => {
    try {
      const { params: { id } = {} } = req;
      console.log("get hisbyid called");
      console.log({ id });
      let his = await hisService.getHisById(id);
      return this.raiseSuccess(res, 200, { his }, "Data Retrive successfully");
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };

  updateHis = async (req, res) => {
    const { params: { id } = {} } = req;
    console.log({ id });
    let data = req.body;
    try {
      if (
        !(
          data.his_password === "" ||
          data.his_password === null ||
          data.his_password === undefined
        )
      ) {
        const password = process.config.DEFAULT_PASSWORD;
        const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
        const hash = await bcrypt.hash(password, salt);
        data = { ...data, his_password: hash };
      }
      let his = await hisService.updateHis(data, id);
      return this.raiseSuccess(res, 200, { his }, "His added successfully");
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };

  deleteHis = async (req, res) => {
    try {
      const { params: { id } = {} } = req;
      let his = await hisService.deleteHis(id);
      return this.raiseSuccess(res, 200, { his }, "His Deleted successfully");
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };

  signIn = async (req, res) => {
    try {
      const { his_username, his_password } = req.body;
      const expiresIn = "60d"; // expires in 30 day
      const secret = process.config.TOKEN_SECRET_KEY;

      // get hisby username
      let hisData = await hisService.getHisByUsername(his_username);

      let {
        his_password: dbpass,
        his_username: dbusername,
        id: his_id,
      } = hisData;
      console.log({ dbusername, dbpass });
      let passwordMatch = false;
      passwordMatch = await bcrypt.compare(his_password, dbpass);
      console.log({ passwordMatch });

      if (passwordMatch) {
        const accessToken = await jwt.sign({ his_id }, secret, {
          expiresIn,
        });
        return this.raiseSuccess(
          res,
          200,
          { accessToken },
          "Data retrieved successfully"
        );
      }

      return this.raiseServerError(
        res,
        401,
        {},
        `Username or Password Incorrect.`
      );
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new HisController();