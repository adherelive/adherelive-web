import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/features";

class FeaturesService {
  getAllFeatures = async data => {
    try {
      const features = await Database.getModel(TABLE_NAME).findAll({
        raw: true
      });
      return features;
    } catch (error) {
      throw error;
    }
  };

  getFeatureByName = async name => {
    try {
      const feature = await Database.getModel(TABLE_NAME).findOne({
        where: { name }
      });
      return feature;
    } catch (error) {
      throw error;
    }
  };
}

export default new FeaturesService();
