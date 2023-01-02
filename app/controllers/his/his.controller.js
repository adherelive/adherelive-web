/**
 * @author Gaurav Sharma
 * @email gaurav6421@gmail.com
 * @create date 2023-01-02 09:57:39
 * @modify date 2023-01-02 14:11:44
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
      const password = process.config.DEFAULT_PASSWORD;
      const salt = await bcrypt.genSalt(Number(process.config.saltRounds));
      const hash = await bcrypt.hash(password, salt);
      his = await hisService.createHis({ ...data, his_password: hash });
      return this.raiseSuccess(res, 200, { his }, "His added successfully");
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  listAllHis = async (req, res) => {
    try {
      his = await hisService.getAllHis();
      return this.raiseSuccess(res, 200, { his }, "Data retrived successfully");
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  getHisById = async (req, res) => {
    try {
      const { params: { id } = {} } = req;
      his = await hisService.createHis(id);
      return this.raiseSuccess(res, 200, { his }, "Data Retrive successfully");
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  updateHis = async (req, res) => {
    const { params: { id } = {} } = req;
    const data = req.body;
    try {
      his = await hisService.updateHis(data, id);
      return this.raiseSuccess(res, 200, { his }, "His added successfully");
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  deleteHis = async (req, res) => {
    try {
      const { params: { id } = {} } = req;
      his = await hisService.deleteHis(id);
      return this.raiseSuccess(res, 200, { his }, "His Deleted successfully");
    } catch (error) {
      return this.raiseServerError(res);
    }
  };

  signIn = async (req, res) => {
    try {
      const { his_username, his_password } = req.body;
      const expiresIn = "60d"; // expires in 30 day
      const secret = process.config.TOKEN_SECRET_KEY;
      console.log(req.body);
      const accessToken = await jwt.sign({ providerId: 2 }, secret, {
        expiresIn,
      });

      return this.raiseSuccess(
        res,
        200,
        { accessToken },
        "Initial data retrieved successfully"
      );
    } catch (error) {
      Logger.debug("signIn 500 error ----> ", error);
      return this.raiseServerError(res);
    }
  };
}

export default new HisController();
