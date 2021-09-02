"use strict";

import { TABLE_NAME } from "../app/models/foodGroups";
import { TABLE_NAME as portionTableName } from "../app/models/portions";
import { TABLE_NAME as foodItemTableName } from "../app/models/foodItems";
import { TABLE_NAME as foodItemDetailsTableName } from "../app/models/foodItemDetails";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      portion_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: portionTableName
          },
          key: "id"
        }
      },
      food_item_detail_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: foodItemDetailsTableName
          },
          key: "id"
        }
      },
      serving: {
        type: Sequelize.FLOAT(11, 2),
        allowNull: false
      },
      details: {
        type: Sequelize.JSON
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  }
};
