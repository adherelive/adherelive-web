"use strict";
import {DataTypes} from "sequelize";

export const TABLE_NAME = "user_favourites";
import {USER_FAV_USER_CATEGORY, USER_FAV_ALL_TYPES} from "../../constant";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_category_id: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false,
      },
      user_category_type: {
        type: DataTypes.ENUM,
        values: USER_FAV_USER_CATEGORY,
        required: true,
        allowNull: false,
      },
      marked_favourite_id: {
        type: DataTypes.INTEGER,
        required: true,
        allowNull: false,
      },
      marked_favourite_type: {
        type: DataTypes.ENUM,
        values: USER_FAV_ALL_TYPES,
        required: true,
        allowNull: false,
      },
      details: {
        type: DataTypes.JSON,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // const {TABLE_NAME} = database.models || {};
  // associations here (if any) ...
};
