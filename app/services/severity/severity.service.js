import {Op} from "sequelize";
import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/severity";

class SeverityService {
  getAll = async () => {
    try {
      const severity = await Database.getModel(TABLE_NAME).findAll();
      return severity;
    } catch (error) {
      throw error;
    }
  };
  
  search = async (data) => {
    try {
      const severity = await Database.getModel(TABLE_NAME).findAll({
        where: {
          name: {
            [Op.like]: `%${data}%`,
          },
        },
      });
      return severity;
    } catch (error) {
      throw error;
    }
  };
  
  getByData = async (data) => {
    try {
      const severity = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return severity;
    } catch (error) {
      throw error;
    }
  };
}

export default new SeverityService();
