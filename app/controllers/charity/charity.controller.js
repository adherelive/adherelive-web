const charityService = require("../../services/charity");
const { validationResult } = require("express-validator/check");
const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("charityController");
const userService = require("../../services/user/user.service");
const moment = require("moment");

const errMessage = require("../../../config/messages.json").errMessages;

class CharityController {
  async fetchCharities(req, res) {
    try {
      const result = await charityService.getAllCharities();

      console.log("result====================== :", result);
      const charity = {};
      for (const data of result) {
        const { _id } = data;
        const users = await userService.getUserForCharity(_id);
        charity[_id] = { ...data, levelCount: users.length };
      }
      let response = new Response(true, 200);
      response.setData({ charity });
      response.setMessage("Dispensation Added Successfully!!!");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      console.log("err------------------- :", err);
      let response = new Response(false, 500);
      response.setError(errMessage.INTERNAL_SERVER_ERROR);
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new CharityController();
