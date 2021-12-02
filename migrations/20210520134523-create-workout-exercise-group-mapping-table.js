"use strict";

import { TABLE_NAME } from "../app/models/workoutExerciseGroupMapping";
import { TABLE_NAME as workoutTableName } from "../app/models/workoutExerciseGroupMapping";
import { TABLE_NAME as exerciseGroupTableName } from "../app/models/exerciseGroup";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      workout_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: workoutTableName,
          },
          key: "id",
        },
      },
      exercise_group_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: exerciseGroupTableName,
          },
          key: "id",
        },
      },
      // time: {
      //   type: DataTypes.DATE,
      //   allowNull: false,
      // },
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

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
