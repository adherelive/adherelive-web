"use strict";
import { DataTypes } from "sequelize";

export const TABLE_NAME = "workout_template_exercise_mappings";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      workout_template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      exercise_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {};
