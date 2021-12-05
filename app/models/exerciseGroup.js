"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as exerciseDetailTableName} from "./exerciseDetails";
import {TABLE_NAME as repetitionTableName} from "./exerciseRepetition";

export const TABLE_NAME = "exercise_groups";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      sets: {
        type: DataTypes.INTEGER,
      },
      details: {
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
  database.models[TABLE_NAME].hasOne(database.models[exerciseDetailTableName], {
    foreignKey: "id",
    sourceKey: "exercise_detail_id",
  });
  
  // database.models[TABLE_NAME].hasOne(database.models[repetitionTableName], {
  //   foreignKey: "repetition_id",
  //   targetKey: "id",
  // });
};
