"use strict";
import { TABLE_NAME } from "../app/models/userFavourites";
import { USER_FAV_USER_CATEGORY } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "user_category_type", {
        type: Sequelize.ENUM,
        values: USER_FAV_USER_CATEGORY,
        required: true,
        allowNull: false
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "user_category_type")
    ]);
  }
};
