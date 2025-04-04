import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceSubscribeTransaction";

import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB > SUBSCRIPTION TRANSACTION > SERVICES");

class serviceSubscribeTransaction {
  // constructor() { }

  addServiceSubscriptionTx = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const addServiceSubscriptionTx = await Database.getModel(
        TABLE_NAME
      ).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return addServiceSubscriptionTx;
    } catch (error) {
      logger.debug(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllServiceSubscriptionTx = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  updateServiceSubscriptionTx = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      logger.debug(data, id);
      const serviceSubscriptionTx = await Database.getModel(TABLE_NAME).update(
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
      return serviceSubscriptionTx;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new serviceSubscribeTransaction();
