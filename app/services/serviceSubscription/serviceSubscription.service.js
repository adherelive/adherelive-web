import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceSubscriptions";
import ServiceSubscriptionMapping from "../../services/serviceSubscriptionMapping/serviceSubscritpionMapping.service";
//import { TABLE_NAME as serviceSubscriptionMapping } from "../../models/serviceSubscriptionMapping";

export default class ServiceSubscriptionService {
  constructor() {}

  addServiceSubscription = async (data) => {
    let services = [];
    if (data.services) {
      services = data.services;
      delete data.services;
    }

    const transaction = await Database.initTransaction();
    try {
      const serviceSubscription = await Database.getModel(TABLE_NAME).create(
        data,
        {
          raw: true,
          transaction,
        }
      );

      await transaction.commit();
      const serviceSubscriptionMapping = new ServiceSubscriptionMapping();
      let servicesData = [];
      let serviceSubscriptionMappingData = {};
      for (let i = 0; i < services.length; i++) {
        serviceSubscriptionMappingData = {
          subscription_plan_id: serviceSubscription.id,
          service_plan_id: services[i]["service_id"],
          service_frequency: services[i]["frequency"],
        };
        serviceSubscriptionMappingData =
          await serviceSubscriptionMapping.addServiceSubscriptionMapping(
            serviceSubscriptionMappingData
          );
        servicesData.push(serviceSubscriptionMappingData);
      }
      serviceSubscription.services = servicesData;
      return serviceSubscription;
    } catch (error) {
      log.debug(error);
      await transaction.rollback();
      throw error;
    }
  };

  updateServiceSubscription = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      log.debug(data, id);
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

  getServiceSubscriptionByData = async (data) => {
    log.debug("getServiceSubscriptionByDataCalled - services - ", data);
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  getAllServiceSubscriptionByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
        // order: [["test_date", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  };
}
