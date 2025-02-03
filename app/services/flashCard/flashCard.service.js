import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/flashCard";

import { createLogger } from "../../../libs/log";
const log = createLogger("WEB > FLASH CARD > SERVICE");

/**
 *
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
  addFlashCard = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const flashCard = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return flashCard;
    } catch (error) {
      log.debug(error);
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
  getAllFlashCardByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  /**
   *
   *
   * @param data
   * @param id
   * @returns {Promise<*>}
   */
  updateFlashCardByData = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const serviceSubscription = await Database.getModel(TABLE_NAME).update(
        data,
        {
          where: {
            id,
          },
          raw: true,
          returning: true,
          transaction,
        }
      );
      await transaction.commit();
      return serviceSubscription;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
