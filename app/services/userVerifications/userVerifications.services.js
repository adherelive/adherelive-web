import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/userVerifications";

class UserVerificationsService {
  async addRequest(data) {
    try {
      const response = await Database.getModel(TABLE_NAME).create(data);
      return response;
    } catch (err) {
      throw err;
    }
  }
  
  async getRequestByLink(link) {
    try {
      const verification = await Database.getModel(TABLE_NAME).findOne({
        where: {
          request_id: link,
        },
      });
      return verification;
    } catch (err) {
      throw err;
    }
  }
  
  updateVerification = async (data, link) => {
    try {
      const verification = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          request_id: link,
        },
      });
      return verification;
    } catch (error) {
      throw error;
    }
  };
  
  getRequestByData = async (data) => {
    try {
      const verification = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return verification;
    } catch (err) {
      throw err;
    }
  };
}

export default new UserVerificationsService();
