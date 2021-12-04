import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/doctorPatientFeatureMapping";

class DoctorPatientFeatureMappingService {
  create = async (data) => {
    try {
      const doctorPatientFeatureMapping = await Database.getModel(
        TABLE_NAME
      ).create(data);
      return doctorPatientFeatureMapping;
    } catch (error) {
      throw error;
    }
  };
  
  getById = async (id) => {
    try {
      const doctorPatientFeatureMapping = await Database.getModel(
        TABLE_NAME
      ).findOne({
        where: {id},
      });
      return doctorPatientFeatureMapping;
    } catch (error) {
      throw error;
    }
  };
  
  getByData = async (data) => {
    try {
      const doctorPatientFeatureMapping = await Database.getModel(
        TABLE_NAME
      ).findAll({
        where: data,
      });
      return doctorPatientFeatureMapping;
    } catch (error) {
      throw error;
    }
  };
  
  deleteMapping = async (mapping_data) => {
    const transaction = await Database.initTransaction();
    try {
      const {patient_id, doctor_id, feature_id} = mapping_data;
      const deletedDetails = await Database.getModel(TABLE_NAME).destroy({
        where: {
          patient_id,
          doctor_id,
          feature_id,
        },
      });
      await transaction.commit();
      return deletedDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new DoctorPatientFeatureMappingService();
