"use strict";
import { TABLE_NAME } from "../app/models/userFavourites";
import { USER_FAV_ALL_TYPES } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "marked_favourite_type", {
        allowNull: false,
        type: Sequelize.ENUM,
        values: USER_FAV_ALL_TYPES,
      }),
      queryInterface.addColumn(TABLE_NAME, "details", {
        type: Sequelize.JSON,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "marked_favourite_type"),
      queryInterface.removeColumn(TABLE_NAME, "details"),
    ]);
  },
};
