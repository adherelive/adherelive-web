"use strict";
import { DataTypes } from "sequelize";

export const TABLE_NAME = "features";

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
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      details: {
        type: DataTypes.JSON,
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
            name: this.name,
            details: this.details
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
