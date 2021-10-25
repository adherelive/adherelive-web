import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/conditions";

class ConditionService {
  getAll = async () => {
    try {
      const condition = await Database.getModel(TABLE_NAME).findAll();
      return condition;
    } catch (error) {
      throw error;
    }
  };

  search = async (data) => {
    try {
      const condition = await Database.getModel(TABLE_NAME).findAll({
        where: {
          name: {
            [Op.like]: `${data}%`,
          },
        },
      });
      return condition;
    } catch (error) {
      throw error;
    }
  };

  getAllByData = async (data) => {
    try {
      const condition = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return condition;
    } catch (error) {
      throw error;
    }
  };

  getByData = async (data) => {
    try {
      const condition = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return condition;
    } catch (error) {
      throw error;
    }
  };
}

export default new ConditionService();
