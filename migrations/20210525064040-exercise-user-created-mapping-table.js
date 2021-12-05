"use strict";

import {TABLE_NAME} from "../app/models/exerciseUserCreatedMapping";
import {TABLE_NAME as exerciseTableName} from "../app/models/exercise";
import {USER_CATEGORY} from "../constant";

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
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
        defaultValue: USER_CATEGORY.DOCTOR,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
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
