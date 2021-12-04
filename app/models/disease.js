"use strict";
import {DataTypes} from "sequelize";

export const DISEASES = "diseases";

export const db = (database) => {
  database.define(
    DISEASES,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      description: {
        type: DataTypes.STRING(1000),
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
            description: this.description,
          };
        }
      }
    }
  );
};

export const associate = (database) => {
  // const {TABLE_NAME} = database.models || {};
  
  // associations here (if any) ...
};