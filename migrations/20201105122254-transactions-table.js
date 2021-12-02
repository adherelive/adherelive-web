"use strict";

import {
  TABLE_NAME,
  TRANSACTION_MODES,
  STATUS,
  TRANSACTION_STATUS,
} from "../app/models/transactions";
import { USER_CATEGORY_ARRAY } from "../app/models/users";
import { DataTypes } from "sequelize";
import { TABLE_NAME as paymentProductTableName } from "../app/models/paymentProducts";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      payment_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: paymentProductTableName,
          },
          key: "id",
        },
      },
      mode: {
        type: DataTypes.ENUM,
        values: TRANSACTION_MODES,
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      requestor_id: {
        type: DataTypes.INTEGER,
      },
      requestor_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY,
      },
      payee_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      payee_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY,
      },
      transaction_response: {
        type: DataTypes.JSON,
      },
      status: {
        type: DataTypes.ENUM,
        values: TRANSACTION_STATUS,
        defaultValue: STATUS.PENDING,
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
