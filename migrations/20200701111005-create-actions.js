"use strict";

import { ACTION_TYPE, DB_TABLES } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.ACTIONS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      care_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.CARE_PLANS
          },
          key: "id"
        }
      },
      type: {
        type: Sequelize.ENUM,
        values: [ACTION_TYPE.MEDICATION, ACTION_TYPE.WORKOUT, ACTION_TYPE.DIET],
        allowNull: false
      },
      frequency_per_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reference_link: {
        type: Sequelize.STRING(1000)
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(DB_TABLES.ACTIONS);
  }
};
