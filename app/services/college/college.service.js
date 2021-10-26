import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/college";

class CollegeService {
  getAll = async () => {
    try {
      const college = await Database.getModel(TABLE_NAME).findAll();
      return college;
    } catch (error) {
      throw error;
    }
  };

  search = async (data) => {
    try {
      const college = await Database.getModel(TABLE_NAME).findAll({
        where: {
          name: {
            [Op.like]: `%${data}%`,
          },
        },
      });
      return college;
    } catch (error) {
      throw error;
    }
  };

  getByData = async (data) => {
    try {
      const college = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return college;
    } catch (error) {
      throw error;
    }
  };

  getCollegeByData = async (data) => {
    try {
      const college = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return college;
    } catch (error) {
      throw error;
    }
  };

  create = async (data) => {
    try {
      const college = await Database.getModel(TABLE_NAME).create(data);
      return college;
    } catch (error) {
      throw error;
    }
  };
}

export default new CollegeService();
