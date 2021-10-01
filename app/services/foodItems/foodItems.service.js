import { Op } from "sequelize";
import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/foodItems";
import { TABLE_NAME as foodItemDetailTableName } from "../../models/foodItemDetails";
import { USER_CATEGORY } from "../../../constant";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class FoodItemsService {
  create = async ({ foodItemData, userData }) => {
    const transaction = await Database.initTransaction();
    try {
      const {
        portion_id=null
      } = foodItemData || {};

      const { userCategoryId : creator_id , category : creator_type } = userData || {};

      const { name: food_item_name, ...rest } = foodItemData;

      // get food item id == > if food item exist for doc or public

      let foodItem = await this.getFoodItem({name:food_item_name , creator_id , creator_type});

      // if doesn't , create
      if (!foodItem) {
        foodItem = await Database.getModel(TABLE_NAME).create(
          {
            name: food_item_name,
            creator_id,
            creator_type
            }, {
            raw: true,
          transaction,
        });
      }

      // use this food item id for detail record
      const { id: food_item_id } = foodItem || {};

      const itemData = {
        food_item_id,
        creator_id,
        creator_type,
        ...rest
      };

      // detail create

      const foodItemDetail = await Database.getModel(foodItemDetailTableName).create(
        itemData
        ,
        {
          raw: true,
          transaction,
        }
      ) || {};

      const { id: food_item_detail_id = null } = foodItemDetail || {};

      await transaction.commit();

      return { food_item_id, food_item_detail_id };
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  getByData = async data => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: data,
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  getFoodItem = async (
    { name,
      creator_id,
      creator_type}
  ) => {
    try {
      return await Database.getModel(TABLE_NAME).findOne({
        where: {
          [Op.or]: [
            { name,
              creator_type : USER_CATEGORY.ADMIN },
            {
              name,
              creator_id,
              creator_type
            }
          ]
        },
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  getItemDetailData = async ({
    food_item_id,
    portion_id,
    creator_id,
    creator_type
  }) => {
    try {
      return await Database.getModel(foodItemDetailTableName).findOne({
        where: {
          [Op.or]: [
            {
              food_item_id,
              portion_id,
              creator_type: USER_CATEGORY.ADMIN
            },
            { food_item_id,
              portion_id,
              creator_id,
              creator_type }
          ]
        },
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  update = async ({
    food_item_id,
    item_detail_id,
    foodItemData,
    foodItemDetailData,
    toUpdate,
    canUpdateFoodItem,
    canUpdateFoodItemDetails
  }) => {
    const transaction = await Database.initTransaction();
    try {
      // update food item
      if (canUpdateFoodItem) {
        await Database.getModel(TABLE_NAME).update(foodItemData, {
          where: {
            id:food_item_id,
          },
          raw: true,
          transaction,
        });
      }

      let foodItemDetail = {} , food_item_detail_id = null  ;

      // update food item details if exists else create

      const {
         portion_id,
        ...rest 
      } = foodItemDetailData || {};

      if (toUpdate && canUpdateFoodItemDetails) {

        foodItemDetail = await Database.getModel(foodItemDetailTableName).update(rest, {
            where: {
            id:item_detail_id,
            },
            raw: true,
          transaction,
        }) || {};

        food_item_detail_id = item_detail_id;
      } else {

        foodItemDetail = await Database.getModel(foodItemDetailTableName).create(
            foodItemDetailData,
            {
              raw: true,
            transaction,
            }
        ) || {};

        const { id = null } = foodItemDetail || {};
        food_item_detail_id = id;
      }

      await transaction.commit();

      return { food_item_id, food_item_detail_id };
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
        include: [Database.getModel(foodItemDetailTableName)],
        attributes,
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  // search =  async ({name,creator_id,creator_type}) => {
  //   try {
  //     return await Database.getModel(TABLE_NAME).findAll({
  //       where: {
  //         [Op.or]: [
  //           {
  //             name: {
  //               [Op.like]: `%${name}%`,
  //             },
  //             creator_type : USER_CATEGORY.ADMIN
  //           },
  //           {
  //             name: {
  //               [Op.like]: `%${name}%`,
  //             },
  //             creator_id,
  //             creator_type }
  //         ]
  //       },
  //       raw: true
  //     });
  //   } catch (error) {
  //     throw error;
  //   }
  // };

  search = async ({ name, creator_id, creator_type }) => {
    try {
      const records = await Database.getModel(TABLE_NAME).findAll({
        where: {
          [Op.or]: [
            {
              name: {
                [Op.like]: `%${name}%`,
              },
              creator_type: USER_CATEGORY.ADMIN
            },
            {
              name: {
                [Op.like]: `%${name}%`,
              },
              creator_id,
              creator_type
            }
          ]
        },
        include: [
          {
            model: Database.getModel(foodItemDetailTableName),
            where: {
              [Op.or]: [
                {
                  creator_type: USER_CATEGORY.ADMIN
                },
                {
                  creator_id,
                  creator_type }
              ]
            }
          }
        ]
      });

      return JSON.parse(JSON.stringify(records));
    } catch (error) {
      throw error;
    }
  };

  findOne = async (data) => {
    try {
      const records = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include:[Database.getModel(foodItemDetailTableName)],
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
}

export default FoodItemsService;
