import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/featureDetails";

class FeatureDetailsService {
  getDetailsByData = async (data) => {
    try {
      const featureDetails = Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return featureDetails;
    } catch (err) {
      throw err;
    }
  };
  
  getManyByData = async (data) => {
    try {
      const featureDetails = Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return featureDetails;
    } catch (err) {
      throw err;
    }
  };
  
  update = async (data, feature_type) => {
    const transaction = await Database.initTransaction();
    try {
      const featureDetails = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          feature_type,
        },
        transaction,
        returning: true,
      });
      transaction.commit();
      console.log("FeatureDetails --> ", featureDetails);
      return featureDetails;
    } catch (err) {
      console.log("err --> ", err);
      transaction.rollback();
      throw err;
    }
  };
  
  add = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const featureDetails = Database.getModel(TABLE_NAME).create(data);
      transaction.commit();
      return featureDetails;
    } catch (err) {
      transaction.rollback();
      throw err;
    }
  };
}

export default new FeatureDetailsService();
