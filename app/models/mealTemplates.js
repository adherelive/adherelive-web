import { DataTypes } from "sequelize";
import { TABLE_NAME as userTableName } from "./users";
import { TABLE_NAME as foodItemDetailsTableName } from "./foodItemDetails";
import { TABLE as foodItemTableName } from "./foodItems";
import { TABLE_NAME as mealTemplateMappingTableName } from "./mealTemplateFoodItemMapping";

import { USER_CATEGORY_ARRAY } from "./users";

export const TABLE_NAME = "meal_templates";

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
        type: DataTypes.STRING,
                allowNull: false,
      },
      creator_id: {
        type: DataTypes.INTEGER,
                allowNull:false,
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY,
        allowNull: false
      },
      details: {
        type: DataTypes.JSON
      }
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


    database.models[TABLE_NAME].belongsToMany(database.models[foodItemDetailsTableName], {
      through: mealTemplateMappingTableName
    });
};
