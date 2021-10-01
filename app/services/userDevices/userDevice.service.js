import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/userDevices";
import { Op } from "sequelize";
import moment from "moment";

class UserDeviceService {
    addDevice = async (data) => {
    try {
      const userDevice = await Database.getModel(TABLE_NAME).create(data);
      return userDevice;
    } catch (error) {
      throw error;
    }
  };

    getDeviceByData = async (data) => {
    try {
      const userDevice = await Database.getModel(TABLE_NAME).findOne({
        where: data
      });
      return userDevice;
    } catch (error) {
      throw error;
    }
  };

    getAllDeviceByData = async (data) => {
    const inactivityDaysLimit = process.config.app.inactivity_days_no;
        const dateFrom = moment().subtract(parseInt(inactivityDaysLimit, 10),'d');
    try {
      const userDevice = await Database.getModel(TABLE_NAME).findAll({
        where: {
          ...data,
          updated_at: {
            [Op.gte]: dateFrom
          }
        }
      });
      return userDevice;
    } catch (error) {
      throw error;
    }
  };

    deleteDevice = async (data) => {
    try {
      const userDevice = await Database.getModel(TABLE_NAME).destroy({
        where: data,
        force: true
      });
      return userDevice;
    } catch (error) {
      throw error;
    }
  };

  updateDevice = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const userDevice = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return userDevice;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new UserDeviceService();
