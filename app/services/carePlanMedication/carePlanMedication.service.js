import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/carePlanMedications";

class CarePlanMedicationService {
  getAllByData = async data => {
    try {
      const carePlanMedications = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return carePlanMedications;
    } catch (error) {
      throw error;
    }
  };

  getCarePlanMedicationByData = async data => {
    try {
      const carePlanMedications = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return carePlanMedications;
    } catch (error) {
      throw error;
    }
  };

  deleteCarePlanMedicationByMedicationId = async medication_id => {
    try {
      const carePlanMedications = await Database.getModel(TABLE_NAME).destroy({
        where: {
          medication_id
        }
      });
      return carePlanMedications;
    } catch (err) {
      throw err;
    }
  };

  getCareplanByMedication = async data => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        attributes: ["care_plan_id"]
      });
    } catch (error) {
      throw error;
    }
  };

  getMedicationsByCarePlanId = async care_plan_id => {
    try {
      const carePlanMedications = await Database.getModel(TABLE_NAME).findAll({
        where: { care_plan_id }
      });
      return carePlanMedications;
    } catch (error) {
      throw error;
    }
  };

  addCarePlanMedication = async data => {
    try {
      const carePlanMedication = await Database.getModel(TABLE_NAME).create(
        data
      );
      return carePlanMedication;
    } catch (error) {
      throw error;
    }
  };
}

export default new CarePlanMedicationService();
