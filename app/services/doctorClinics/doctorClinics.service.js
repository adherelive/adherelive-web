import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/doctorClinics";

class DoctorClinicService {
  constructor() {}

  addClinic = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const doctorClinic = await Database.getModel(TABLE_NAME).create(data, {transaction});
      await transaction.commit();
      return doctorClinic;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  updateClinic = async (data,id) => {
    const transaction = await Database.initTransaction();
    try {
        const doctorClinic = await Database.getModel(TABLE_NAME).update(data,{
            where: {
                id,
                deleted_at:null
            },
            transaction
        });
        await transaction.commit();
        return doctorClinic;
    } catch(error) {
        await transaction.rollback();
        throw error;
    }
  };

  getClinicForDoctor = async doctor_id => {
    try {
        const doctorClinic = await Database.getModel(TABLE_NAME).findAll({
            where: {
                doctor_id
            }
        });
        return doctorClinic;
      } catch (error) {
        throw error;
      } 
  };

  getClinicById = async (id) => {
    try {
      const doctorClinic = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id,
        },
      });
      return doctorClinic;
    } catch (error) {
      throw error;
    }
  };
}

export default new DoctorClinicService();
