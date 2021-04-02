"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as userTableName } from "./users";
import { USER_CATEGORY} from "../../constant";

export const TABLE_NAME = "profiles";

export const db = database => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      user_id: {
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
            profile_id: this.id,
            user_id: this.user_id,
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
    foreignKey: "user_id",
    targetKey: "id"
  });
};
