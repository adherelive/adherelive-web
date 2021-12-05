import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/providers";
import {TABLE_NAME as userTableName} from "../../models/users";

class ProviderService {
  getAll = async () => {
    try {
      const provider = await Database.getModel(TABLE_NAME).findAll();
      return provider;
    } catch (err) {
      throw err;
    }
  };
  
  getProviderByData = async (data) => {
    try {
      const provider = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [Database.getModel(userTableName)],
      });
      return provider;
    } catch (err) {
      throw err;
    }
  };
  
  getAllProviders = async () => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        include: [Database.getModel(userTableName)],
      });
    } catch (err) {
      throw err;
    }
  };
  
  addProvider = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const provider = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });
      await transaction.commit();
      return provider;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };
  
  updateProvider = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const provider = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction,
      });
      await transaction.commit();
      return provider;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };
}

export default new ProviderService();
