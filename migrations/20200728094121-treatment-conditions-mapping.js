"use strict";

import { TABLE_NAME } from "../app/models/treatmentConditionMapping";
import { TABLE_NAME as treatmentTableName } from "../app/models/treatments";
import { TABLE_NAME as conditionTableName } from "../app/models/conditions";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      condition_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: conditionTableName,
          },
          key: "id",
        },
      },
      treatment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: treatmentTableName,
          },
          key: "id",
        },
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
