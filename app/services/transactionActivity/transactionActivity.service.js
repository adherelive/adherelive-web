import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/transactionActivity";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("SERVICE TRANSACTION ACTIVITY");

export default class ServiceSubscriptionMapping {
  constructor() {}

  addTransactionActivate = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const txActivate = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return txActivate;
    } catch (error) {
      logger.error("Add and Activate Transactions ", error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllTxActivitiesByData = async (data, sort_duedate = null) => {
    let query_args = {
      where: data,
      raw: true,
      // order: [["test_date", "DESC"]],
    };
    if (sort_duedate) {
      query_args = {
        where: data,
        raw: true,
        order: [["due_date", sort_duedate.toUpperCase()]],
      };
    }
    try {
      let mappingData = await Database.getModel(TABLE_NAME).findAll(query_args);

      /**
       * TODO:
      for (let svc in mappingData) {
          let serviceOfferingService = new ServiceOfferingService();
          let service = await serviceOfferingService.getServiceOfferingByData({
              id: mappingData[svc].service_plan_id,
          });
          mappingData[svc].serviceDetails = service;
      }*/
      return { ...mappingData };
    } catch (error) {
      throw error;
    }
  };

  updateTxActivities = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const txActivate = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        raw: true,
        returning: true,
        transaction,
      });
      await transaction.commit();
      return txActivate;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
