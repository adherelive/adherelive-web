"use strict";

import { TABLE_NAME } from "../app/models/exerciseDetails";
import { TABLE_NAME as exerciseTableName } from "../app/models/exercise";
import { TABLE_NAME as repetitionTableName } from "../app/models/exerciseRepetition";
import { USER_CATEGORY } from "../constant";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: exerciseTableName,
          },
          key: "id",
        },
      },
      repetition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: repetitionTableName,
          },
          key: "id",
        },
      },
      repetition_value: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creator_id: {
        type: DataTypes.INTEGER,
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
        defaultValue: USER_CATEGORY.ADMIN,
      },
      calorific_value: {
        type: DataTypes.FLOAT(11, 2),
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
