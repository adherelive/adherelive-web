import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/medicines";

class MedicineService {
  constructor() {}

  add = async data => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).create(data);
      return medicine;
    } catch (err) {
      throw err;
    }
  };

  search = async data => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findAll({
        where: {
          name: {
            [Op.like]: `${data}%`
          }
        }
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  getMedicineById = async id => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id
        }
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  getMedicineByData = async data => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };

  getAllMedicines = async () => {
    try {
      const medicine = await Database.getModel(TABLE_NAME).findAll({
        raw: true
      });
      return medicine;
    } catch (error) {
      throw error;
    }
  };
}

export default new MedicineService();
