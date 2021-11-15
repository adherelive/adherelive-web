import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/accountDetails";
import { Op } from "sequelize";

class AccountDetailsService {
  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return accountDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  addAccountDetails = async data => {
    const transaction = await Database.initTransaction();
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).create(data, {
        transaction
      });
      await transaction.commit();
      return accountDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getCurrentAccountByUserId = async user_id => {
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).findOne({
        where: {
          [Op.and]: [{ user_id }, { in_use: true }]
        }
      });
      return accountDetails;
    } catch (error) {
      throw error;
    }
  };

  getAllAccountsForUser = async user_id => {
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).findAll({
        where: {
          user_id
        }
      });
      return accountDetails;
    } catch (error) {
      throw error;
    }
  };

  getByData = async data => {
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).findOne({
        where: data
      });
      return accountDetails;
    } catch (error) {
      throw error;
    }
  };

  updateInUseForAccount = async user_id => {
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).update(
        { in_use: false },
        {
          where: {
            [Op.and]: [{ user_id }, { in_use: true }]
          }
        }
      );
      return accountDetails;
    } catch (error) {
      throw error;
    }
  };

  deleteAccountDetails = async id => {
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        }
      });
      return accountDetails;
    } catch (error) {
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const accountDetails = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      await transaction.commit();
      return accountDetails;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new AccountDetailsService();
