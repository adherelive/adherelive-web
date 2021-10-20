import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/templateWorkouts";

export default class TemplateWorkoutService {
  create = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const templateWorkout = await Database.getModel(TABLE_NAME).create(data, {
        transaction,
      });

      await transaction.commit();
      return templateWorkout;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const updateTemplateWorkout = await Database.getModel(
        TABLE_NAME
      ).update(data, { where: { id }, transaction });
      await transaction.commit();
      return updateTemplateWorkout;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  delete = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const deletedTemplateWorkout = await Database.getModel(
        TABLE_NAME
      ).destroy({
        where: data,
        transaction,
      });
      await transaction.commit();
      return deletedTemplateWorkout;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findOne = async ({ data }) => {
    try {
      return (
        (await Database.getModel(TABLE_NAME).findOne({
          where: data,
        })) || null
      );
    } catch (error) {
      throw error;
    }
  };
}
