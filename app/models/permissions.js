"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as userCategoryPermissionTableName } from "./userCategoryPermissions";
import { TABLE_NAME as userTableName } from "./users";

export const TABLE_NAME = "permissions";

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
      type: {
        type: DataTypes.STRING(100),
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // associations here (if any) ...
  database.models[TABLE_NAME].belongsToMany(database.models[userTableName], {
    through: userCategoryPermissionTableName,
    foreignKey: "category",
  });
};
