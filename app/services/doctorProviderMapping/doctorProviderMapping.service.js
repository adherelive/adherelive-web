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
}

export default new DoctorProviderMappingService();
