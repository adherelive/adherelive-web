import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/subscriptions";
import { TABLE_NAME as paymentProductTableName } from "../../models/paymentProducts";

import Op from "sequelize/lib/operators";
import moment from "moment";

export default class SubscriptionService {
  getByData = async data => {
    try {
      const subscriptions = Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true
      });
      return subscriptions;
    } catch (error) {
      throw error;
    }
  };

  getAllTodayRenewingData = async () => {
    try {
      const subscriptions = Database.getModel(TABLE_NAME).findAll({
        where: {
          renew_on: {
            [Op.between]: [
              moment()
                .startOf("day")
                .toISOString(),
              moment()
                .endOf("day")
                .toISOString()
            ]
          }
        },
        raw: true,
        include: [
          {
            model: Database.getModel(paymentProductTableName),
            exclude: ["created_at", "updated_at"]
          }
        ]
      });
      return subscriptions;
    } catch (error) {
      throw error;
    }
  };

  createSubscription = async data => {
    try {
      const subscriptions = Database.getModel(TABLE_NAME).create(data, {
        raw: true
      });
      return subscriptions;
    } catch (error) {
      throw error;
    }
  };

  updateSubscription = async (data, id) => {
    const transaction = Database.initTransaction();
    try {
      const subscriptions = Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        raw: true,
        transaction
      });
      transaction.commit();
      return subscriptions;
    } catch (error) {
      transaction.rollback();
      throw error;
    }
  };
}
