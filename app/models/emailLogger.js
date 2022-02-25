"use strict";
import { DataTypes } from "sequelize";

export const EMAIL_LOGGERS = "email_loggers";

export const db = (database) => {
  database.define(
    EMAIL_LOGGERS,
    {
      id: {
        type: DataTypes.BIGINT,
        primaryKey: true,
        autoIncrement: true,
        unsigned: true,
      },
      data: {
        type: "json",
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            data: this.data,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // const {TABLE_NAME} = database.models || {};
  // associations here (if any) ...
};
