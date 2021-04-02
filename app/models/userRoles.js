"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as userTableName } from "./users";
import { USER_CATEGORY} from "../../constant";

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
      category_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      category_type: {
            type: DataTypes.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.PROVIDER, USER_CATEGORY.ADMIN],
            allowNull: false,
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
            category_id: this.category_id,
            category_type: this.category_type
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
