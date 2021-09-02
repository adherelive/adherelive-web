"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as permissionTableName } from "./permissions";
import { USER_CATEGORY_ARRAY } from "./users";

export const TABLE_NAME = "user_category_permissions";

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
      category: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY
      },
      permission_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: permissionTableName
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
  // const {<TABLE_NAME>} = database.models || {};
  // associations here (if any) ...
};
