import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceOffering";

export default class ServiceOfferingService {
  constructor() {}

  addServiceOffering = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const serviceOffering = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return serviceOffering;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw error;
    }
  };

  updateServiceOffering = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const serviceOffering = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        raw: true,
        returning: true,
        transaction,
      });
      await transaction.commit();
      return serviceOffering;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getServiceOfferingByData = async (data) => {
    console.log("getServiceOfferingByDataCalled - services - ", data);
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  getAllServiceOfferingByData = async (data) => {
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
