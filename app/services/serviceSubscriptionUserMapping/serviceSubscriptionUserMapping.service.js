import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceSubscriptionUserMapping";

import { createLogger } from "../../../libs/log";
const log = createLogger("WEB > SUBSCRIPTION USER MAPPING > SERVICES");

export default class ServiceUserMapping {
  constructor() {}

  addServiceSubscriptionUserMapping = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const serviceSubscriptionUserMapping = await Database.getModel(
        TABLE_NAME
      ).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return serviceSubscriptionUserMapping;
    } catch (error) {
      log.debug(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllServiceSubscriptionUserMappingByData = async (data) => {
    try {
      log.debug(TABLE_NAME);
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  updateServiceSubscriptionUserMapping = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      /**
       * TODO: Remove this code?
      {
       notes: 'asdasdasdasdasd',
       durations: 2,
       service_charge: 1000,
       patient_status: 'active'
      }
        */
      log.debug(data, id);
      const serviceSubscriptionUserMapping = await Database.getModel(
        TABLE_NAME
      ).update(data, {
        where: {
          id,
        },
        raw: true,
        returning: true,
        transaction,
      });
      await transaction.commit();
      return serviceSubscriptionUserMapping;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
