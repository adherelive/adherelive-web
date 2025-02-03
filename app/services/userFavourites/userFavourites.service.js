import Database from "../../../libs/mysql";

// TABLES
import { TABLE_NAME } from "../../models/userFavourites";

import { createLogger } from "../../../libs/log";

const log = createLogger("WEB > USER_FAVOURITES > SERVICE");

class UserFavouritesService {
  constructor() {}

  markFavourite = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const markedRecord = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return markedRecord;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getAllFavourites = async (data) => {
    try {
      const favourite = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
      return favourite;
    } catch (error) {
      throw error;
    }
  };

  findExistingFavourite = async (data) => {
    try {
      const existing = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
      return existing;
    } catch (error) {
      throw error;
    }
  };

  getByData = async (data) => {
    try {
      const favourite = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
      return favourite;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const deleteFavourite = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id,
        },
        paranoid: false,
      });
      return deleteFavourite;
    } catch (error) {
      log.info("32784284576237463256948723 ERRRRO", error);
      throw error;
    }
  };
}

export default new UserFavouritesService();
