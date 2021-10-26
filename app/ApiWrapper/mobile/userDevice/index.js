import BaseUserDevice from "../../../services/userDevices";
import UserDeviceService from "../../../services/userDevices/userDevice.service";

class UserDeviceWrapper extends BaseUserDevice {
  constructor(data) {
    super(data);
  }

  getAllInfo = () => {
    const { _data } = this;
    return {
      ..._data,
    };
  };
}

export default async ({ data = null, id = null, user_id = null }) => {
  if (data) {
    return new UserDeviceWrapper(data);
  }
  const userDevice = await UserDeviceService.getByData({ user_id });
  return new UserDeviceWrapper(userDevice);
};
