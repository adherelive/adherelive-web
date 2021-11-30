"use strict";
import { TABLE_NAME } from "../app/models/foodItems";
import { USER_CATEGORY } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "creator_type", {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.HSP,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "creator_type"),
    ]);
  },
};
