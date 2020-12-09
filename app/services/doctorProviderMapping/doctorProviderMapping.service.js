import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/doctorProviderMapping";

class DoctorProviderMappingService {
  createDoctorProviderMapping = async data => {
    try {
      const doctorProviderMapping = await Database.getModel(TABLE_NAME).create(
        data
      );
      return doctorProviderMapping;
    } catch (error) {
      throw error;
    }
  };

  getDoctorProviderMappingByData = async data => {
    try {
      const doctorProviderMapping = await Database.getModel(TABLE_NAME).findAll(
        {
          where: data
        }
      );
      return doctorProviderMapping;
    } catch (error) {
      throw error;
    }
  };

  getProviderForDoctor = async doctor_id => {
    try {
      const doctorProviderMapping = await Database.getModel(TABLE_NAME).findOne(
        {
          where: {
            doctor_id
          }
        }
      );
      return doctorProviderMapping;
    } catch (error) {
      throw error;
    }
  };
}

export default new DoctorProviderMappingService();
