import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceUserMapping";

export default class ServiceUserMapping {
  constructor() {}

  addServiceUserMapping = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const serviceUserMapping = await Database.getModel(TABLE_NAME).create(
        data,
        {
          raw: true,
          transaction,
        }
      );
      log.info(serviceUserMapping);
      await transaction.commit();
      return serviceUserMapping;
    } catch (error) {
      log.info(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllServiceUserMappingByData = async (data) => {
    try {
      log.info(TABLE_NAME);
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
        // order: [["test_date", "DESC"]],
      });
    } catch (error) {
      throw error;
    }
  };

  updateServiceUserMapping = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      log.info(data, id);
      const serviceUserMapping = await Database.getModel(TABLE_NAME).update(
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
      return serviceUserMapping;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
