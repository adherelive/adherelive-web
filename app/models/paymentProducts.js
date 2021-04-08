"use strict";
import { DataTypes } from "sequelize";
import { USER_CATEGORY_ARRAY } from "./users";
import {TABLE_NAME as transactionTableName} from "./transactions";

export const TABLE_NAME = "payment_products";

const ONE_TIME = "1";
const RECURRING = "2";

export const PRODUCT_USER_TYPES = [
  "patient",
  "platform"
];

export const PAYMENT_TYPE = {
  ONE_TIME: ONE_TIME,
  RECURRING: RECURRING
};

export const PAYMENT_PRODUCT_TYPES = [
    PAYMENT_TYPE.ONE_TIME,
    PAYMENT_TYPE.RECURRING
];

export const db = database => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      type: {
        type: DataTypes.ENUM,
        values: PAYMENT_PRODUCT_TYPES,
        allowNull: false
      },
      amount: {
          type: DataTypes.INTEGER,
      },
      creator_role_id: {
        type: DataTypes.INTEGER
        // allowNull: false
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY,
        allowNull: false
      },
      for_user_role_id: {
          type: DataTypes.INTEGER,
          allowNull: false
      },
      for_user_type: {
          type: DataTypes.ENUM,
          values: USER_CATEGORY_ARRAY,
      },
      product_user_type: {
          type: DataTypes.ENUM,
          values: PRODUCT_USER_TYPES,
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

export const associate = database => {
  // associations here (if any) ...
    database.models[TABLE_NAME].belongsTo(database.models[transactionTableName], {
        foreignKey: "id",
        targetKey: "payment_product_id"
    });
};
