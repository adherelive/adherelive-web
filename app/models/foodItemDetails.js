import { DataTypes } from "sequelize";
import { TABLE_NAME as foodItemTableName } from "./foodItems";
import { TABLE_NAME as portionTableName } from "./portions";

import { USER_CATEGORY_ARRAY } from "./users";

export const TABLE_NAME = "food_item_details";

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
      food_item_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      portion_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      portion_size: {
        type: DataTypes.FLOAT(11, 2),
        allowNull: false,
      },
      calorific_value: {
        type: DataTypes.FLOAT(11, 2),
      },
      carbs: {
        type: DataTypes.FLOAT(11, 2),
      },
      proteins: {
        type: DataTypes.FLOAT(11, 2),
      },
      fats: {
        type: DataTypes.FLOAT(11, 2),
      },
      fibers: {
        type: DataTypes.FLOAT(11, 2),
      },
      details: {
        type: DataTypes.JSON,
      },
      creator_id: {
        type: DataTypes.INTEGER,
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // const {upload_documents} = database.models || {};

  // associations here (if any) ...

  database.models[TABLE_NAME].belongsTo(database.models[foodItemTableName], {
    foreignKey: "food_item_id",
    targetKey: "id",
  });

  // database.models[foodItemTableName].hasOne(database.models[TABLE_NAME], {
  //   foreignKey: "food_item_id",
  //   sourceKey: "id",
  // }); //

  database.models[TABLE_NAME].belongsTo(database.models[portionTableName], {
    foreignKey: "portion_id",
    targetKey: "id",
  });
};
