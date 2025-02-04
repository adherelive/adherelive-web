import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceSubscriptionMapping";
import { TABLE_NAME as ServiceOfferingTableName } from "../../models/serviceOffering";
import ServiceOfferingService from "../serviceOffering/serviceOffering.service";

import { createLogger } from "../../../libs/logger";
const logger = createLogger("WEB > SUBSCRIPTION MAPPING > SERVICES");

export default class ServiceSubscriptionMapping {
  constructor() {}

  addServiceSubscriptionMapping = async (data) => {
    logger.debug(data);
    const transaction = await Database.initTransaction();
    try {
      const serviceSubscriptionMapping = await Database.getModel(
        TABLE_NAME
      ).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return serviceSubscriptionMapping;
    } catch (error) {
      logger.debug(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllServiceSubscriptionMappingByData = async (data) => {
    try {
      let mappingData = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
        // order: [["test_date", "DESC"]],
      });

      for (let svc in mappingData) {
        let serviceOfferingService = new ServiceOfferingService();
        let service = await serviceOfferingService.getServiceOfferingByData({
          id: mappingData[svc].service_plan_id,
        });
        mappingData[svc].serviceDetails = service;
      }
      return { ...mappingData };
    } catch (error) {
      throw error;
    }
  };
}
