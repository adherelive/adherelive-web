"use strict";
import { DataTypes } from "sequelize";
import { TERMS_AND_CONDITIONS_TYPES } from "../../constant";

export const TABLE_NAME = "terms_and_conditions";

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
      terms_type: {
        type: DataTypes.ENUM,
        values: [...Object.values(TERMS_AND_CONDITIONS_TYPES)]
      },
      details: {
        type: DataTypes.JSON
      }
    },
    {
      underscored: true,
      paranoid: true
    }
  );
};

export const associate = database => {};
