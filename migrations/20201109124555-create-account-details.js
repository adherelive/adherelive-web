"use strict";

import { TABLE_NAME, ACCOUNT_TYPES } from "../app/models/accountDetails";
import { TABLE_NAME as userTableName } from "../app/models/users";
import { DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userTableName,
          },
          key: "id",
        },
      },
      customer_name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      account_number: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      upi_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      ifsc_code: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      account_type: {
        type: DataTypes.ENUM,
        values: [ACCOUNT_TYPES.SAVINGS, ACCOUNT_TYPES.CURRENT],
        allowNull: false,
      },
      account_mobile_number: {
        type: DataTypes.STRING,
        allow_null: false,
      },
      prefix: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      in_use: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      razorpay_account_id: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      razorpay_account_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
