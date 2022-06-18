"use strict";
import { DataTypes } from "sequelize";
import { MEDICINE_TYPE } from "../../constant";

export const TABLE_NAME = "medicines";

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
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      type: {
        type: DataTypes.STRING,
        // values: [MEDICINE_TYPE.TABLET, MEDICINE_TYPE.INJECTION, MEDICINE_TYPE.SYRUP],
        defaultValue: MEDICINE_TYPE.TABLET
      },
      description: {
        type: DataTypes.STRING(1000)
      },
      details: {
        type: DataTypes.JSON
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      public_medicine: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
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
            description: this.description
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
