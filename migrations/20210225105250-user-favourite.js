"use strict";

import {USER_FAV_USER_CATEGORY, USER_FAV_ALL_TYPES} from "../constant";
import {TABLE_NAME} from "../app/models/userFavourites";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_category_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      user_category_type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: USER_FAV_USER_CATEGORY,
      },
      marked_favourite_id: {
        allowNull: false,
        type: Sequelize.INTEGER,
      },
      marked_favourite_type: {
        allowNull: false,
        type: Sequelize.ENUM,
        values: USER_FAV_ALL_TYPES,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
