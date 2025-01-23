"use strict";

import { TABLE_NAME } from "../app/models/exerciseGroup";
import { TABLE_NAME as exerciseDetailTableName } from "../app/models/exerciseDetails";
import { TABLE_NAME as repetitionTableName } from "../app/models/exerciseRepetition";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: exerciseDetailTableName,
          },
          key: "id",
        },
      },
      sets: {
        type: DataTypes.INTEGER,
      },
      details: {
        type: DataTypes.JSON,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
