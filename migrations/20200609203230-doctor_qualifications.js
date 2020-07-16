'use strict';

import { DB_TABLES, GENDER } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.DOCTOR_QUALIFICATIONS, {
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
      degree_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.DEGREE,
          },
          key: 'id'
        }
      },
      college_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.COLLEGE,
          },
          key: 'id'
        }
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      // photos:{
      //   type: Sequelize.JSON
      // },
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
    return queryInterface.dropTable(DB_TABLES.DOCTOR_QUALIFICATIONS);
  }
};
