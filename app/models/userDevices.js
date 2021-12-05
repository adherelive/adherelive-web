"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as userTableName} from "./users";

export const TABLE_NAME = "user_devices";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      platform: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      one_signal_user_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      push_token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // const {<TABLE_NAME>} = database.models || {};
  // associations here (if any) ...
};
