import database from "../../../libs/mysql";

const {user_devices: UserDevices} = database.models;

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
                where: data,
                force: true
            });
            return userDevice;
        } catch(error) {
            throw error;
        }
    };

    updateDevice = async (data, id) => {
        const transaction = await database.transaction();
        try {
            const userDevice = await UserDevices.update(data, {
                where: {
                    id
                },
                transaction
            });
            await transaction.commit();
            return userDevice;
        } catch(error) {
            await transaction.rollback();
            throw error;
        }
    };

}

export default new UserDeviceService();