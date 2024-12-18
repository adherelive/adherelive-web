"use strict";

import { USER_CATEGORY } from "../../constant";
import { TABLE_NAME } from "../models/foodItemDetails";

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      await queryInterface.bulkInsert(
        TABLE_NAME,
        [
          {
            food_item_id: 1,
            portion_id: 1,
            portion_size: 1,
            calorific_value: 100,
            carbs: 100,
            proteins: 100,
            fats: 100,
            fibers: 100,
            creator_type: USER_CATEGORY.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            food_item_id: 2,
            portion_id: 1,
            portion_size: 0.5,
            calorific_value: 200,
            carbs: 200,
            proteins: 200,
            fats: 200,
            fibers: 200,
            creator_type: USER_CATEGORY.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            food_item_id: 3,
            portion_id: 1,
            portion_size: 3,
            calorific_value: 300,
            carbs: 300,
            proteins: 300,
            fats: 300,
            fibers: 300,
            creator_type: USER_CATEGORY.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            food_item_id: 4,
            portion_id: 1,
            portion_size: 4,
            calorific_value: 400,
            carbs: 400,
            proteins: 400,
            fats: 400,
            fibers: 400,
            creator_type: USER_CATEGORY.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            food_item_id: 5,
            portion_id: 1,
            portion_size: 2,
            calorific_value: 500,
            carbs: 500,
            proteins: 500,
            fats: 500,
            fibers: 500,
            creator_type: USER_CATEGORY.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
          },
          {
            food_item_id: 6,
            portion_id: 1,
            portion_size: 1,
            calorific_value: 600,
            carbs: 600,
            proteins: 600,
            fats: 600,
            fibers: 600,
            creator_type: USER_CATEGORY.ADMIN,
            created_at: new Date(),
            updated_at: new Date(),
          },
        ],
        { transaction }
      );
    });
  },
  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (transaction) => {
      // Delete dependent records if necessary
      // await queryInterface.bulkDelete('dependent_table', { food_item_id: <id> }, { transaction });
      return queryInterface.bulkDelete(TABLE_NAME, null, { transaction });
    });
  },
};

//   down: (queryInterface) => {
//     return queryInterface.bulkDelete(TABLE_NAME, null, {});
//   },
// }
// };
