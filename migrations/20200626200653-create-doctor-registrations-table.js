'use strict';

import {DB_TABLES} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.DOCTOR_REGISTRATIONS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.DOCTORS,
          },
          key: 'id'
        }
      },
      number: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      council: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: false
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
    return queryInterface.dropTable(DB_TABLES.DOCTOR_REGISTRATIONS);
  }
};
