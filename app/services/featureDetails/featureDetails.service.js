import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/featureDetails";

class FeatureDetailsService {
  getDetailsByData = async data => {
    try {
      const featureDetails = Database.getModel(TABLE_NAME).findOne({
        where: data
      });
      return featureDetails;
    } catch (err) {
      throw err;
    }
  };

  getManyByData = async data => {
    try {
      const featureDetails = Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return featureDetails;
    } catch (err) {
      throw err;
    }
  };
}

export default new FeatureDetailsService();
