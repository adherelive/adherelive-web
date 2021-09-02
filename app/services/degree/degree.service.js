import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/degree";

class DegreeService {
  getAll = async () => {
    try {
      const degree = await Database.getModel(TABLE_NAME).findAll();
      return degree;
    } catch (error) {
      throw error;
    }
  };

  search = async data => {
    try {
      const degree = await Database.getModel(TABLE_NAME).findAll({
        where: {
          name: {
            [Op.like]: `%${data}%`
          }
        }
      });
      return degree;
    } catch (error) {
      throw error;
    }
  };

  getByData = async data => {
    try {
      const degree = await Database.getModel(TABLE_NAME).findOne({
        where: data
      });
      return degree;
    } catch (error) {
      throw error;
    }
  };

  getDegreeByData = async data => {
    try {
      const degree = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return degree;
    } catch (error) {
      throw error;
    }
  };

  create = async data => {
    try {
      const degree = await Database.getModel(TABLE_NAME).create(data);
      return degree;
    } catch (error) {
      throw error;
    }
  };
}

export default new DegreeService();
