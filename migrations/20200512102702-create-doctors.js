"use strict";

import { DB_TABLES, GENDER } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.DOCTORS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.USERS,
          },
          key: 'id'
        }
      },
      registration_number: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      registration_start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      registration_expiry_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      gender: {
        type: Sequelize.ENUM,
        values: [GENDER.MALE, GENDER.FEMALE, GENDER.TRANS],
        allowNull: true
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      middle_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      address: {
        type: Sequelize.STRING,
        allowNull: false
      },
      qualifications: {
        type: Sequelize.JSON,
      },
      activated_on: {
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
    return queryInterface.dropTable(DB_TABLES.DOCTORS);
  }
};
