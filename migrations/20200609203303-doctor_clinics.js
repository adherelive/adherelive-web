'use strict';

import { DB_TABLES } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.DOCTOR_CLINICS, {
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
      name: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      location: {
        type: Sequelize.STRING(400),
        allowNull: false,
      },
      start_time: {
        type: Sequelize.DATE
      },
      end_time:{
        type:Sequelize.DATE
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
    return queryInterface.dropTable(DB_TABLES.DOCTOR_CLINICS);
  }
};
