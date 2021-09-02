"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as userTableName } from "./users";
import { USER_CATEGORY } from "../../constant";

export const TABLE_NAME = "user_roles";

export const db = database => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_identity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userTableName
          },
          key: "id"
        }
      },
      linked_with: {
        type: DataTypes.ENUM,
        values: [USER_CATEGORY.PROVIDER, USER_CATEGORY.ADMIN],
        allowNull: true
      },
      linked_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            user_identity: this.user_identity,
            linked_with: this.linked_with,
            linked_id: this.linked_id
          };
        }
      }
    }
  );
};

export const associate = database => {
  database.models[TABLE_NAME].belongsTo(database.models[userTableName], {
    foreignKey: "user_identity",
    targetKey: "id"
  });
};
