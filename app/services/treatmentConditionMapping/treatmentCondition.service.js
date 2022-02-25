import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/treatmentConditionMapping";

class TreatmentConditionService {
  getAll = async (data) => {
    try {
      const treatmentCondition = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return treatmentCondition;
    } catch (error) {
      throw error;
    }
  };
}

export default new TreatmentConditionService();
