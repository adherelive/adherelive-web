"use strict";
import { DataTypes } from "sequelize";

export const TABLE_NAME = "severity";

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
      }
    },
    {
      underscored: true,
      paranoid: true,
      freezeTableName: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            name: this.name
          };
        }
      }
    }
  );
};

export const associate = database => {
  // const {<TABLE_NAME>} = database.models || {};
  // associations here (if any) ...
};
