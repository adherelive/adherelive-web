import { DataTypes } from "sequelize";
import { TABLE_NAME as dietFoodGroupMappingTableName } from "./dietFoodGroupMapping";

import { USER_CATEGORY_ARRAY } from "./users";

export const TABLE_NAME = "similar_food_mappings";

export const db = database => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      related_to_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: dietFoodGroupMappingTableName
          },
          key: "id"
        }
      },
      secondary_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: dietFoodGroupMappingTableName
          },
          key: "id"
        }
      }
    },
    {
      underscored: true,
      paranoid: true
    }
  );
};

export const associate = database => {
  // const {upload_documents} = database.models || {};
  // associations here (if any) ...
};
