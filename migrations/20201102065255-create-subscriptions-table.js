"use strict";

import { DataTypes } from "sequelize";
import { TABLE_NAME } from "../app/models/subscriptions";
import { TABLE_NAME as paymentProductPlansTableName } from "../app/models/paymentProducts";
import { USER_CATEGORY_ARRAY } from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      payment_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: paymentProductPlansTableName
          },
          key: "id"
        }
      },
      subscriber_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY,
        allowNull: false
      },
      subscriber_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      activated_on: {
        type: DataTypes.DATE
      },
      renew_on: {
        type: DataTypes.DATE
      },
      expired_on: {
        type: DataTypes.DATE,
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  }
};
