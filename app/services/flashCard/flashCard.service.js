import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/flashCard";

export default class ServiceOfferingService {
  constructor() {}

  addFlashCard = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const flashCard = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
      });
      await transaction.commit();
      return flashCard;
    } catch (error) {
      log.info(error);
      await transaction.rollback();
      throw error;
    }
  };

  getAllFlashCardByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: data,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };

  updateFlashCardByData = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const serviceSubscription = await Database.getModel(TABLE_NAME).update(
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
      return serviceSubscription;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
}
