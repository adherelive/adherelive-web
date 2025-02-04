import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/userFavourites";

import { createLogger } from "../../../libs/log";
const logger = createLogger("WEB > USER_FAVOURITES > SERVICE");

/**
 *
 *
 * @class UserFavouritesService
 */
class UserFavouritesService {
  constructor() {}

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
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

  /**
   *
   *
   * @param data
   * @returns {Promise<Model[]>}
   */
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

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
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

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
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

  /**
   *
   *
   * @param id
   * @returns {Promise<*>}
   */
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
      logger.debug("Error while deleting a User Favourite: ", error);
      throw error;
    }
  };
}

export default new UserFavouritesService();
