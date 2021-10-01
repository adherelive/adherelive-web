import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/doctorQualifications";

class DoctorQualificationService {
  constructor() {}

  addQualification = async data => {
    const transaction = await Database.initTransaction();
    try {
          const doctorQualification = await Database.getModel(TABLE_NAME).create(data, {transaction});
      await transaction.commit();
      return doctorQualification;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getQualificationsByDoctorId = async doctor_id => {
    try {
      const doctorQualification = await Database.getModel(TABLE_NAME).findAll({
        where: {
          doctor_id,
          deleted_at: null
        }
      });
      return doctorQualification;
    } catch (error) {
      throw error;
    }
  };

  getQualificationById = async id => {
    try {
      const doctorQualification = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id,
          deleted_at: null
        }
      });
      return doctorQualification;
    } catch (error) {
      throw error;
    }
  };

  updateQualification = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
            const doctorQualification = await Database.getModel(TABLE_NAME).update(data,{
          where: {
            id,
            deleted_at: null
          },
          transaction
            });
      await transaction.commit();
      return doctorQualification;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getQualificationsByDoctorId = async doctor_id => {
    try {
      const doctorQualification = await Database.getModel(TABLE_NAME).findAll({
        where: {
          doctor_id,
          deleted_at: null
        }
      });
      return doctorQualification;
    } catch (error) {
      throw error;
    }
  };

  getQualificationByData = async (doctor_id, degree, college, year) => {
    try {
      const doctorQualification = await Database.getModel(TABLE_NAME).findOne({
        where: {
          doctor_id,
          degree,
          college,
          year,
          deleted_at: null
        }
      });
      return doctorQualification;
    } catch (error) {
      throw error;
    }
  };
}

export default new DoctorQualificationService();
