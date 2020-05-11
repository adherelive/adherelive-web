const Response = require("../../helper/responseFormat");
import User from "../../models/user";
import UserDevices from "../../models/userDevices";

class UserDevice {
  async addUserDevice(req, res) {
    try {
      const { userId: currUserId } = req.userDetails;
      const { platform, one_signal_user_id, push_token } = req.body || {};
      console.log("-----jshvdujvsiudsv-----------------", req.body);
      const user = await User.findOne({
        _id: currUserId
      }).lean();
      // console.log("user==============>", user);
      if (user) {
        const userDevice = await UserDevices.findOne({
          one_signal_user_id: one_signal_user_id,
          user_id: currUserId
        }).lean();
        if (!userDevice) {
          await UserDevices.create({
            user_id: currUserId,
            platform: platform,
            one_signal_user_id: one_signal_user_id,
            push_token: push_token
          });
          console.log("============sjyadvfyus :::::device added");

          let response = new Response(true, 200);
          response.setData({});
          response.setMessage("User device added successfully");
          return res.send(response.getResponse());
        }
      } else {
        let response = new Response(false, 401);
        response.setError({ message: "User does not exist" });
        return res.status(401).json(response.getResponse());
      }
    } catch (e) {
      console.log("eroor-----================== :", e);
      let payload;
      switch (error.message) {
        case constants.COOKIES_NOT_SET:
          payload = {
            code: 403,
            error: errMessage.COOKIES_NOT_SET
          };
          break;
        case constants.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE:
          payload = {
            code: 401,
            error: errMessage.ADDITION_TO_PROGRAM_NOT_PERMISSIBLE
          };
          break;
        default:
          payload = {
            code: 500,
            error: errMessage.INTERNAL_SERVER_ERROR
          };
          break;
      }

      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async removeDevice(req, res) {
    try {
      const { userId: user_id } = req.userDetails;

      const { device_id: one_signal_user_id } = req.body;
      await UserDevices.deleteOne({ user_id, one_signal_user_id });
      console.log(
        "============sjyadvfyus :::::device removed",
        user_id,
        one_signal_user_id,
        req.body
      );
      let response = new Response(true, 200);
      return res.status(response.getStatusCode()).json(response.getResponse());
    } catch (err) {
      let response = new Response(false, 500);
      response.setError("unable to user device");
      return res.status(500).json(response.getResponse());
    }
  }
}

module.exports = new UserDevice();
