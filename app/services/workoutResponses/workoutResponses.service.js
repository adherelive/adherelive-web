import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/workoutResponses";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class WorkoutResponsesService {
  create = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction
      });
      await transaction.commit();
      return record.id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  bulkCreate = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).bulkCreate(data, {
        transaction
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findOne = async data => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  update = async ({ id, ...data }) => {
    const transaction = await Database.initTransaction();
    try {
      await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        transaction
      });
      await transaction.commit();
      return true;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
      });
    } catch (error) {
      throw error;
    }
  };

   findOne = async (data) => {
    try {
      const diet = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true
      });
      return diet;
    } catch (error) {
      throw error;
    }
  };

  delete = async (id) => {
    try {
      const record = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        },
      });
      return record;
    } catch (err) {
      throw err;
    }
  };
}

export default WorkoutResponsesService;
