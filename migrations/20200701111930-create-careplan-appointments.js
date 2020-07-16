'use strict';

import { DB_TABLES } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.CARE_PLAN_APPOINTMENTS, {
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
            tableName: DB_TABLES.CARE_PLANS,
          },
          key: 'id'
        }
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.APPOINTMENTS,
          },
          key: 'id'
        }
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
    return queryInterface.dropTable(DB_TABLES.CARE_PLAN_APPOINTMENTS);
  }
};
