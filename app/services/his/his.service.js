/**
 * @author Gaurav Sharma
 * @email gaurav6421@gmail.com
 * @create date 2023-01-02 10:23:31
 * @modify date 2023-01-02 19:07:57
 * @desc services for his table.
 */
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/his";
import { createLogger } from "../../../libs/logger";

const logger = createLogger("WEB > HIS > SERVICE");

class HisService {
  constructor() {}

  createHis = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const response = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });
      await transaction.commit();
      return response;
    } catch (err) {
      await transaction.rollback();
      throw err;
    }
  };

  getAllHis = async () => {
    try {
      const user = await Database.getModel(TABLE_NAME).findAll();
      return user;
    } catch (err) {
      logger.debug(err);
      throw err;
    }
  };

  getHisById = async (id) => {
    try {
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: { id },
      });
      return user;
    } catch (err) {
      logger.debug(err);
      throw err;
    }
  };

  updateHis = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const user = await Database.getModel(TABLE_NAME).update(data, {
        where: { id },
        transaction,
      });
      await transaction.commit();
      return user;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  deleteHis = async (id) => {
    try {
      const users = await Database.getModel(TABLE_NAME).destroy({
        where: { id },
      });
      return users;
    } catch (err) {
      throw err;
    }
  };

  getHisByUsername = async (his_username) => {
    try {
      const user = await Database.getModel(TABLE_NAME).findOne({
        where: { his_username },
      });
      return user;
    } catch (err) {
      logger.debug(err);
      throw err;
    }
  };
}

export default new HisService();
