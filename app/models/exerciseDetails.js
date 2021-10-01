"use strict";
import { DataTypes } from "sequelize";
import { USER_CATEGORY } from "../../constant";
import { TABLE_NAME as exerciseTableName } from "./exercise";
import { TABLE_NAME as repetitionTableName } from "./exerciseRepetition";

export const TABLE_NAME = "exercise_details";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      repetition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
          USER_CATEGORY.HSP
        ],
        defaultValue: USER_CATEGORY.ADMIN
      },
      calorific_value: {
        type: DataTypes.FLOAT(11, 2),
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  database.models[TABLE_NAME].belongsTo(database.models[exerciseTableName], {
    foreignKey: "exercise_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].belongsTo(database.models[repetitionTableName], {
    foreignKey: "repetition_id",
    targetKey: "id",
  });
};
