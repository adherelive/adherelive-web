import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceOffering";

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
   * @memberOf ServiceOfferingService
   * @param data
   * @returns {Promise<*>}
   */
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
      log.debug(error);
      await transaction.rollback();
      throw error;
    }
  };

  /**
   *
   *
   * @memberOf ServiceOfferingService
   * @param data
   * @param id
   * @returns {Promise<*>}
   */
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

  /**
   *
   *
   * @memberOf ServiceOfferingService
   * @param data
   * @returns {Promise<*>}
   */
  getServiceOfferingByData = async (data) => {
    // log.debug("getServiceOfferingByDataCalled - services - ", data);
    try {
      return await Database.getModel(TABLE_NAME).findOne({
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
   * @memberOf ServiceOfferingService
   * @param data
   * @returns {Promise<Model[]>}
   */
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
