import Database from "../../../libs/mysql";
import { Op } from "sequelize";
import { TABLE_NAME } from "../../models/portions";

class PortionServiceService {
  constructor() {}

  getByData = async (data) => {
    try {
      const portion = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return portion;
    } catch (error) {
      throw error;
    }
  };

  getAll = async () => {
    try {
      const portions = await Database.getModel(TABLE_NAME).findAll();
      return portions;
    } catch (error) {
      throw error;
    }
  };

  search = async (data) => {
    try {
      const portions = await Database.getModel(TABLE_NAME).findAll({
        where: {
          name: {
            [Op.like]: `%${data}%`,
          },
        },
      });
      return portions;
    } catch (error) {
      throw error;
    }
  };
}

export default PortionServiceService;
