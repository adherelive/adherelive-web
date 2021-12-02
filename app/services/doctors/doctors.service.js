import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/doctors";
import { TABLE_NAME as specialityTableName } from "../../models/specialities";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class DoctorsService {
  constructor() {}

  addDoctor = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const doctor = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });

      await transaction.commit();
      return doctor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getDoctorByUserId = async (user_id) => {
    try {
      const doctor = await Database.getModel(TABLE_NAME).findOne({
        where: {
          user_id,
        },
        include: Database.getModel(specialityTableName),
      });
      return doctor;
    } catch (error) {
      throw error;
    }
  };

  updateDoctor = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const doctor = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction,
      });
      await transaction.commit();
      return doctor;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getDoctorByData = async (data) => {
    try {
      const doctor = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return doctor;
    } catch (error) {
      throw error;
    }
  };

  findOne = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where,
        order,
        attributes,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
}

export default new DoctorsService();
