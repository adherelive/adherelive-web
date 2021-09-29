import { Op } from "sequelize";
import Database from "../../../libs/mysql";

import { TABLE_NAME } from "../../models/foodItemDetails";
import { TABLE_NAME as portionTableName } from "../../models/portions";
import { TABLE_NAME as foodItemTableName } from "../../models/foodItems";

import { USER_CATEGORY } from "../../../constant";
const DEFAULT_ORDER = [["created_at", "DESC"]];

class FoodItemsService {
  create = async data => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).create(data, {
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

  search = async ({ food_item_id, creator_id, creator_type }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              food_item_id,
              creator_type: USER_CATEGORY.ADMIN
            },
            { food_item_id, creator_id, creator_type }
          ]
        },
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  getByData = async data => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [Database.getModel(portionTableName)],
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  findOne = async data => {
    try {
      const records = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          Database.getModel(foodItemTableName),
          Database.getModel(portionTableName)
        ]
      });

      /* nested raw true is not allowed by sequelize
      Links:
      https://github.com/sequelize/sequelize/issues/3897 (closed)
      https://github.com/sequelize/sequelize/issues/5193 (open)
      */
      return JSON.parse(JSON.stringify(records));
    } catch (error) {
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

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        include: [
          Database.getModel(foodItemTableName),
          Database.getModel(portionTableName)
        ],
        attributes,
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };
}

export default FoodItemsService;
