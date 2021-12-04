"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as userTableName} from "./users";
import {VERIFICATION_TYPE} from "../../constant";

export const TABLE_NAME = "user_verifications";

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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userTableName,
          },
          key: "id",
        },
      },
      request_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING(20),
      },
      type: {
        type: DataTypes.ENUM,
        values: [
          VERIFICATION_TYPE.FORGOT_PASSWORD,
          VERIFICATION_TYPE.SIGN_UP,
          VERIFICATION_TYPE.PATIENT_SIGN_UP,
        ],
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            user_id: this.user_id,
            request_id: this.request_id,
            status: this.status,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const {user_verifications, users} = database.models || {};
  
  // associations here (if any) ...
  user_verifications.belongsTo(users, {
    foreignKey: "user_id",
    targetKey: "id",
  });
};
