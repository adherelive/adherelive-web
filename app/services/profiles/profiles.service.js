import Database from "../../../libs/mysql";

// TABLES
import { TABLE_NAME } from "../../models/profiles";

class ProfileService {
  constructor() {}

  async getAll() {
    try {
      const profiles = await Database.getModel(TABLE_NAME).findAll();
      return profiles;
    } catch (err) {
      console.log(err);
      throw err;
    }
  }

  async createProfile(data) {
    const transaction = await Database.initTransaction();
    try {
      const response = await Database.getModel(TABLE_NAME).create(data, {
        transaction
      });
      await transaction.commit();
      return response;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  }

  getAllProfilesByData = async data => {
    try {
      const profile = await Database.getModel(TABLE_NAME).findAll({
        where: data
      });
      return profile;
    } catch (error) {
      throw error;
    }
  };

  getProfileById = async id => {
    try {
      const profile = await Database.getModel(TABLE_NAME).findOne({
        where: {
          id
        },
      });
      return profile;
    } catch (error) {
      throw error;
    }
  };
}

export default new ProfileService();
