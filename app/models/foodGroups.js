"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as portionTableName } from "./portions";
// import { TABLE_NAME as foodItemTableName } from "./foodItems";
import { TABLE_NAME as foodItemDetailsTableName } from "./foodItemDetails";
// import {TABLE_NAME as dietFoodGroupMappingTableName} from "./dietFoodGroupMapping";

export const TABLE_NAME = "food_groups";

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
      portion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      serving: {
        type: DataTypes.FLOAT(11, 2),
        allowNull: false,
      },
      food_item_detail_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
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
  // const {TABLE_NAME} = database.models || {};
  // associations here (if any) ...

  // associations here (if any) ...
  database.models[TABLE_NAME].hasOne(database.models[portionTableName], {
    foreignKey: "id",
    sourceKey: "portion_id",
  });

  database.models[TABLE_NAME].hasOne(
    database.models[foodItemDetailsTableName],
    {
      foreignKey: "id",
      sourceKey: "food_item_detail_id",
    }
  );
};
