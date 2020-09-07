import UserDevices from "../../models/userDevices";


class UserDeviceService {

    addDevice = async (data) => {
      try {
          const userDevice = await UserDevices.create(data);
          return userDevice;
      } catch(error) {
          throw error;
      }
    };

    getDeviceByData = async (data) => {
        try {
            const userDevice = await UserDevices.findOne({
                where: data
            });
            return userDevice;
        } catch(error) {
            throw error;
        }
    };

    getAllDeviceByData = async (data) => {
        try {
            const userDevice = await UserDevices.findAll({
                where: data
            });
            return userDevice;
        } catch(error) {
            throw error;
        }
    };

    deleteDevice = async (data) => {
        try {
            const userDevice = await UserDevices.destroy({
                where: data
            });
            return userDevice;
        } catch(error) {
            throw error;
        }
    };

}

export default new UserDeviceService();