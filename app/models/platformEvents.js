"use strict";
import {DataTypes} from "sequelize";

export const PLATFORM_EVENTS = "platform_events";

export const db = (database) => {
  database.define(
    PLATFORM_EVENTS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
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
