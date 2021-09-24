"use strict";
import { DataTypes } from "sequelize";

export const REGIONS = "regions";

export const db = database => {
  database.define(
    REGIONS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      activated_on: {
        type: DataTypes.DATE
      }
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            name: this.name,
            activated_on: this.activated_on
          };
        }
      }
    }
  );
};

export const associate = database => {
  // const {TABLE_NAME} = database.models || {};
  // associations here (if any) ...
};
