import Database from "../../../libs/mysql";
import { TABLE_NAME } from "../../models/mealTemplates";
import { TABLE_NAME as mealTemplateMappingsTableName } from "../../models/mealTemplateFoodItemMapping";
import { TABLE_NAME as foodtemDetailsTableName } from "../../models/foodItemDetails";

const DEFAULT_ORDER = [["created_at", "DESC"]];

class MealTemplatesService {
  create = async ({ meal = {}, foodItemDetails = [] }) => {
    const transaction = await Database.initTransaction();
    try {
      const mealTemplate = await Database.getModel(TABLE_NAME).create(meal, {
        raw: true,
        transaction
      });

      const { id: meal_template_id } = mealTemplate || {};

      // create food items mappings
      const foodItemDetailsMapping = foodItemDetails.map(id => {
        return { meal_template_id, food_item_detail_id: id };
      });
      await Database.getModel(mealTemplateMappingsTableName).bulkCreate(
        foodItemDetailsMapping,
        {
          raw: true,
          transaction
        }
      );

      await transaction.commit();
      return meal_template_id;
    } catch (error) {
      await transaction.rollback();
      throw error;
    }
  };

  findOne = async data => {
    try {
      const mealTemplate = await Database.getModel(TABLE_NAME).findOne({
        where: data,
        include: [Database.getModel(foodtemDetailsTableName)]
      });

      /* nested raw true is not allowed by sequelize
      Links:
      https://github.com/sequelize/sequelize/issues/3897 (closed)
      https://github.com/sequelize/sequelize/issues/5193 (open)
      */
      return JSON.parse(JSON.stringify(mealTemplate));
    } catch (error) {
      throw error;
    }
  };

  update = async ({ meal = {}, foodItemDetails = [], id }) => {
    const transaction = await Database.initTransaction();
    try {
      // update name for template if needed
      await Database.getModel(TABLE_NAME).update(meal, {
        where: {
          id
        },
        raw: true,
        transaction
      });

      // check for existing mappings wrt food items and new ones
      const existingMealTemplate = (await this.findOne({ id })) || null;

      const { food_item_details = [] } = existingMealTemplate || {};

      const existingFoodItemDetails =
        food_item_details.map(foodItemDetail => foodItemDetail.id) || [];

      let newFoodItemDetails = [];
      for (let index = 0; index < foodItemDetails.length; index++) {
        const currentFoodItemDetailsId = foodItemDetails[index];
        if (existingFoodItemDetails.indexOf(currentFoodItemDetailsId) === -1) {
          newFoodItemDetails.push({
            meal_template_id: id,
            food_item_detail_id: currentFoodItemDetailsId
          });
        } else {
        }
      }

      // create new mappings for new food items
      await Database.getModel(mealTemplateMappingsTableName).bulkCreate(
        newFoodItemDetails,
        {
          raw: true,
          transaction
        }
      );

      // filter out all food items that are to be removed from mapping
      const foodItemsDetailsToDelete = existingFoodItemDetails.filter(
        foodItemDetailsId => foodItemDetails.indexOf(foodItemDetailsId) === -1
      );

      // delete existing mappings for old food items
      await Database.getModel(mealTemplateMappingsTableName).destroy({
        where: {
          food_item_detail_id: foodItemsDetailsToDelete
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

  findAndCountAll = async ({ where, order = DEFAULT_ORDER, attributes }) => {
    try {
      return await Database.getModel(TABLE_NAME).findAndCountAll({
        where,
        order,
        include: [Database.getModel(foodtemDetailsTableName)],
        attributes,
        raw: true
      });
    } catch (error) {
      throw error;
    }
  };

  delete = async ({ template_id = null }) => {
    const transaction = await Database.initTransaction();
    try {
      await Database.getModel(mealTemplateMappingsTableName).destroy({
        where: {
          meal_template_id: template_id
        },
        transaction
      });

      await Database.getModel(TABLE_NAME).destroy({
        where: {
          id: template_id
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
}

export default MealTemplatesService;
