import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/dietFoodGroupMapping";
import { TABLE_NAME as foodGroupTableName } from "../../models/foodGroups";
import { TABLE_NAME as dietTableName } from "../../models/diet";
import { TABLE_NAME as similarFoodMappingTableName } from "../../models/similarFoodMapping";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class DietFoodGroupMappingService {
  create = async (data) => {
    const transaction = await Database.initTransaction();
    try {
      const record = await Database.getModel(TABLE_NAME).create(data, {
        raw: true,
        transaction,
        include: [
          Database.getModel(foodGroupTableName),
          Database.getModel(dietTableName),
          Database.getModel(similarFoodMappingTableName)
        ]
      });
      await transaction.commit();
      return record;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  // getByData = async data => {
  //   try {
  //     return await Database.getModel(TABLE_NAME).findOne({
  //           where: data,
  //           include: [
  //               Database.getModel(foodGroupTableName),
  //               Database.getModel(dietTableName)
  //           ],
  //           raw: true
  //       });
  //   } catch(error) {
  //       throw error;
  //   }
  // };

  getByData = async data => {
    try {
      const record = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [
          Database.getModel(foodGroupTableName),
          Database.getModel(dietTableName),
          Database.getModel(similarFoodMappingTableName)
        ]
      });

      return JSON.parse(JSON.stringify(record));
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
        include: [
          Database.getModel(foodGroupTableName),
          Database.getModel(dietTableName),
          Database.getModel(similarFoodMappingTableName)
        ],
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
        attributes,
        raw: true
      });
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

export default DietFoodGroupMappingService;
