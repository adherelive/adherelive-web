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
      activated_on: {},
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(DB_TABLES.DOCTORS);
  }
};
