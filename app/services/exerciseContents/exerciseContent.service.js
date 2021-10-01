import Database from "../../../libs/mysql";

import { TABLE_NAME } from "../../models/exerciseContents";

export default class ExerciseContentService {
  create = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const exerciseContent = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });

      await transaction.commit();
      return exerciseContent;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findOne = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
      });
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll= async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where: data,
      });
    } catch (error) {
      throw error;
    }
  };
}
