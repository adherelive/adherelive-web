"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as carePlanTemplateTableName } from "./carePlanTemplate";

export const TABLE_NAME = "template_diets";

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
      care_plan_template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: carePlanTemplateTableName,
          },
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_calories: {
        type: DataTypes.FLOAT(11, 2),
      },
      duration: {
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

export const associate = (database) => {};
