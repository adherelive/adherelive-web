import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/notes";

import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB > NOTES > SERVICE");

/**
 * Duplicated in flashCard.service.js?
 *
 * @class ServiceOfferingService
 */
export default class ServiceOfferingService {
  constructor() {}

  /**
   *
   *
   * @param data
   * @returns {Promise<*>}
   */
  addNotes = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const notes = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return notes;
    } catch (error) {
      logger.debug(error);
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
  getAllNotesByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
}
