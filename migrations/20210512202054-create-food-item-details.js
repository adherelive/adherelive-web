"use strict";

import {
  TABLE_NAME,
  TABLE_NAME as foodItemTableName,
} from "../app/models/foodItemDetails";
import { TABLE_NAME as portionTableName } from "../app/models/portions";
import { USER_CATEGORY_ARRAY } from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      food_item_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: foodItemTableName,
          },
          key: "id",
        },
      },
      portion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: portionTableName,
          },
          key: "id",
        },
      },
      portion_size: {
        type: Sequelize.FLOAT(11, 2),
        allowNull: false,
      },
      calorific_value: {
        type: Sequelize.FLOAT(11, 2),
      },
      carbs: {
        type: Sequelize.FLOAT(11, 2),
      },
      proteins: {
        type: Sequelize.FLOAT(11, 2),
      },
      fats: {
        type: Sequelize.FLOAT(11, 2),
      },
      fibers: {
        type: Sequelize.FLOAT(11, 2),
      },
      details: {
        type: Sequelize.JSON,
      },
      creator_id: {
        type: Sequelize.INTEGER,
      },
      creator_type: {
        type: Sequelize.ENUM,
        values: USER_CATEGORY_ARRAY,
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
