import doctorClinicModel from "../../models/doctorClinics";
import {database} from "../../../libs/mysql";

class DoctorClinicService {
  constructor() {}

  addClinic = async (data) => {
    const transaction = await database.transaction();
    try {
      const doctorClinic = await doctorClinicModel.create(data, {transaction});
      await transaction.commit();
      return doctorClinic;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  updateClinic = async (data,id) => {
    const transaction = await database.transaction();
    try {
        const doctorClinic = await doctorClinicModel.update(data,{
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
        const doctorClinic = await doctorClinicModel.findAll({
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
      const doctorClinic = await doctorClinicModel.findOne({
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
