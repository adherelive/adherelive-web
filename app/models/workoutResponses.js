"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as workoutTableName} from "./workout";
import {TABLE_NAME as exerciseGroupTableName} from "./exerciseGroup";
import {TABLE_NAME as repetitionTableName} from "./exerciseRepetition";
import {TABLE_NAME as scheduleEventsTable} from "./scheduleEvents";

import {WORKOUT_RESPONSE_STATUS} from "../../constant";

export const TABLE_NAME = "workout_responses";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
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
      schedule_event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: scheduleEventsTable,
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
      sets: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          WORKOUT_RESPONSE_STATUS.DONE,
          WORKOUT_RESPONSE_STATUS.EXPIRED,
          WORKOUT_RESPONSE_STATUS.PARTIALLY_DONE,
          WORKOUT_RESPONSE_STATUS.SKIPPED,
        ],
      },
      other_details: {
        type: DataTypes.JSON,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
};
