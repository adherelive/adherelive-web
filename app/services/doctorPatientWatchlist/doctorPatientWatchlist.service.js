import Database from "../../../libs/mysql";

import { TABLE_NAME } from "../../models/doctorPatientWatchlist";

class DoctorPatientWatchlistService {
  async getAll() {
    try {
      const watchlistRecords = await Database.getModel(TABLE_NAME).findAll();
      return watchlistRecords;
    } catch (err) {
      throw err;
    }
  }

  getByData = async (data) => {
    try {
      const record = await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
      return record;
    } catch (error) {
      throw error;
    }
  };

  getAllByData = async (data) => {
    try {
      const record = await Database.getModel(TABLE_NAME).findAll({
        where: data,
      });
      return record;
    } catch (error) {
      throw error;
    }
  };

  updateRecord = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction,
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new DoctorPatientWatchlistService();
