import Controller from "../../index";
import { createLogger } from "../../../../libs/log";

// services
import UserService from "../../../services/user/user.service";
import UserDeviceService from "../../../services/userDevices/userDevice.service";

const log = createLogger("MOBILE > USER_DEVICE > CONTROLLER");

class UserDeviceController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      log.debug("userDevice create req.body ---> ", req.body);
      const { userId } = req.userDetails;
      const { platform, one_signal_user_id, push_token } = req.body || {};
      const userExists = await UserService.getUserData({ id: userId });

      if (userExists) {
        const deviceExists = await UserDeviceService.getDeviceByData({
          one_signal_user_id,
        });
        if (!deviceExists) {
          const userDeviceData = await UserDeviceService.addDevice({
            one_signal_user_id,
            user_id: userId,
            platform: platform,
            push_token: push_token,
          });

          return raiseSuccess(res, 200, {}, "Device added successfully");
        } else {
          const userDeviceData = await UserDeviceService.updateDevice(
            {
              user_id: userId,
              platform: platform,
              push_token: push_token,
            },
            deviceExists.get("id")
          );

          log.debug("userDeviceData", userDeviceData);

          return raiseSuccess(res, 200, {}, "Device user updated successfully");
        }
      } else {
        return raiseClientError(res, 422, {}, "User doesn't exists");
      }
    } catch (error) {
      log.debug("create 500 error - userDevice updated", error);
      return raiseServerError(res);
    }
  };

  delete = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      const { userId: user_id } = req.userDetails;
      const { device_id: one_signal_user_id } = req.body;

      await UserDeviceService.deleteDevice({ user_id, one_signal_user_id });

      return raiseSuccess(res, 200, {}, "Device deleted successfully");
    } catch (error) {
      log.debug("userDevice delete 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new UserDeviceController();
