import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/foodGroups";
import {TABLE_NAME as portionTableName} from "../../models/portions";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class FoodGroupService {
  create = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
        // include: [
        // Database.getModel(portionTableName)
        // ]
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  
  getByData = async (data) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        // include: [
        //   Database.getModel(portionTableName)
        // ],
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
  
  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id,
        },
        // include: [
        //   Database.getModel(portionTableName)
        // ],
        raw: true,
        transaction,
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };
  
  findAndCountAll = async ({where, order = DEFAULT_ORDER, attributes}) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        raw: true,
      });
    } catch (error) {
      throw error;
    }
  };
  
  delete = async (id) => {
    try {
      const record = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id,
        },
      });
      return record;
    } catch (err) {
      throw err;
    }
  };
}

export default FoodGroupService;
