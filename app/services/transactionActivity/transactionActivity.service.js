import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/transactionActivity";
import { TABLE_NAME as ServiceOfferingTableName } from "../../models/serviceOffering";
import ServiceOfferingService from "../serviceOffering/serviceOffering.service";

export default class ServiceSubscriptionMapping {
  constructor() {}

  addTransactionActivite = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const txActivitie = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return txActivitie;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllTxActivitiesByData = async (data) => {
    try {
      let mappingData = await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
        // order: [["test_date", "DESC"]],
      });

      // for (let svc in mappingData) {
      //     let serviceOfferingService = new ServiceOfferingService();
      //     let service = await serviceOfferingService.getServiceOfferingByData({
      //         id: mappingData[svc].service_plan_id,
      //     });
      //     mappingData[svc].serviceDetails = service;
      // }
      return { ...mappingData };
    } catch (error) {
      throw error;
    }
  };

  updateTxActivities = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const txActivitie = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        raw: true,
        returning: true,
        transaction,
      });
      await transaction.commit();
      return txActivitie;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
