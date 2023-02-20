"use strict";

import { TABLE_NAME } from "../app/models/serviceSubscriptionMapping";
import { TABLE_NAME as subscribePlanTableName } from "../app/models/serviceSubecriptions";
import { TABLE_NAME as serviceOfferingTableName } from "../app/models/serviceOffering";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      subscription_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: subscribePlanTableName,
          },
          key: "id",
        },
      },
      service_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: serviceOfferingTableName,
          },
          key: "id",
        },
      },
      service_frequency: {
        type: Sequelize.INTEGER,
        allowNull: false,
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

  down: (queryInterface) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
