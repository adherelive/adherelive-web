import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/mealTemplateFoodItemMapping";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class MealTemplateFoodItemMappingService {
  create = async data => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction
        // include: [
        // Database.getModel(mealTemplateTableName),
        // Database.getModel(foodItemTableName),
        // ]
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  update = async (data, id) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).update(data, {
        where: {
          id
        },
        // include: [
        // Database.getModel(mealTemplateTableName),
        // Database.getModel(foodItemTableName),
        // ],
        raw: true,
        transaction
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getByData = async data => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        // include: [
        // Database.getModel(mealTemplateTableName),
        // Database.getModel(foodItemTableName),
        // ],
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        attributes,
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  delete = async id => {
    try {
      const record = await Database.getModel(TABLE_NAME).destroy({
        where: {
          id
        }
      });
      return record;
    } catch (err) {
      throw err;
    }
  };
}

export default MealTemplateFoodItemMappingService;
