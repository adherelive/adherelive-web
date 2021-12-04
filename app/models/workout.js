"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as carePlanTableName} from "./carePlan";
import {TABLE_NAME as exerciseGroupTableName} from "./exerciseGroup";
import {TABLE_NAME as workoutExerciseGroupMappingTableName} from "./workoutExerciseGroupMapping";

export const TABLE_NAME = "workouts";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      care_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_calories: {
        type: DataTypes.FLOAT(11, 2),
      },
      start_date: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      time: {
        type: DataTypes.DATE,
        allowNull: false,
      },
      details: {
        type: DataTypes.JSON,
      },
      expired_on: {
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  database.models[TABLE_NAME].belongsTo(database.models[carePlanTableName], {
    foreignKey: "care_plan_id",
    targetKey: "id",
  });
  
  database.models[TABLE_NAME].belongsToMany(
    database.models[exerciseGroupTableName],
    {
      through: workoutExerciseGroupMappingTableName,
    }
  );
};
