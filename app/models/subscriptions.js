"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as paymentProductPlansTableName } from "./paymentProducts";
import { USER_CATEGORY_ARRAY } from "./users";

export const TABLE_NAME = "subscriptions";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      payment_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: paymentProductPlansTableName,
          },
          key: "id",
        },
      },
      subscriber_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY,
        allowNull: false,
      },
      subscriber_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      activated_on: {
        type: DataTypes.DATE,
      },
      renew_on: {
        type: DataTypes.DATE,
      },
      expired_on: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  database.models[TABLE_NAME].hasOne(
    database.models[paymentProductPlansTableName],
    {
      foreignKey: "id",
      sourceKey: "payment_product_id",
    }
  );
};
