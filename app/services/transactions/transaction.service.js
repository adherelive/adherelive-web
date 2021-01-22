import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/transactions";
import { TABLE_NAME as paymentProductTableName } from "../../models/paymentProducts";

class TransactionService {

    createTransaction = async (data) => {
        try {
            const transaction = await Database.getModel(TABLE_NAME).create(data, {raw: true});
            return transaction;
        } catch(error) {
            throw error;
        }
    };

    getByData = async (data) => {
        try {
            const transaction = await Database.getModel(TABLE_NAME).findOne({
                where: data,
                raw: true,
                nest: true,
                include: [
                    {
                        model: Database.getModel(paymentProductTableName),
                        // as: paymentProductTableName,
                        exclude: ["created_at","updated_at"]
                    }
                ]
            });
            return transaction;
        } catch(error) {
            throw error;
        }
    };

    getAllByData = async (data) => {
        try {
            const transaction = await Database.getModel(TABLE_NAME).findAll({
                where: data,
                raw: true,
                nest: true,
                include: [
                    {
                        model: Database.getModel(paymentProductTableName),
                        // as: paymentProductTableName,
                        exclude: ["created_at","updated_at"]
                    }
                ]
            });
            return transaction;
        } catch(error) {
            throw error;
        }
    };

  updateTransaction = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const transactions = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        transaction
      });
      transaction.commit();
      return transactions;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  };
}

export default TransactionService;
