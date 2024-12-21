import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/serviceSubscribeTransaction";
import { TABLE_NAME as patientTableName } from "../../models/patients";
import { TABLE_NAME as doctorTableName } from "../../models/doctors";
import { TABLE_NAME as providerTableName } from "../../models/providers";
import { TABLE_NAME as serviceOfferingTableName } from "../../models/serviceOffering";
import { TABLE_NAME as serviceSubscriptionTableName } from "../../models/serviceSubscriptions";

class serviceSubscribeTx {
  // constructor() { }

  addServiceSubscriptionTx = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const addServiceSubscriptionTx = await Database.getModel(
        TABLE_NAME
      ).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return addServiceSubscriptionTx;
    } catch (error) {
      console.log(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllServiceSubscriptionTx = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  updateServiceSubscriptionTx = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      console.log(data, id);
      const serviceSubscriptionTx = await Database.getModel(TABLE_NAME).update(
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
      return serviceSubscriptionTx;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}

export default new serviceSubscribeTx();
