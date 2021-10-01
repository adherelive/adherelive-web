"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as carePlanTableName } from "./carePlan";
import { TABLE_NAME as dietFoodGroupMappingTableName } from "./dietFoodGroupMapping";

export const TABLE_NAME = "diet";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING(1000),
                allowNull: false,
      },
      total_calories: {
        type: DataTypes.FLOAT
      },
      start_date: {
        type: DataTypes.DATE
      },
      end_date: {
        type: DataTypes.DATE
      },
      care_plan_id: {
        type: DataTypes.INTEGER,
                allowNull: false,
      },
      details: {
        type: DataTypes.JSON
      },
      expired_on: {
                type: DataTypes.DATE,
            },
    },
    {
      underscored: true,
      paranoid: true,
            freezeTableName: true,
    }
  );
};

export const associate = (database) => {
  // associations here (if any) ...
  database.models[TABLE_NAME].hasOne(database.models[carePlanTableName], {
    foreignKey: "id",
    sourceKey: "care_plan_id"
  });

    database.models[TABLE_NAME].hasMany(database.models[dietFoodGroupMappingTableName], {
        foreignKey:"diet_id",
        sourceKey:"id"
    });
};
