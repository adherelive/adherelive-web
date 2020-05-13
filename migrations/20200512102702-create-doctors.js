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
        allowNull: false
      },
      gender: {
        type: Sequelize.ENUM,
        values: [GENDER.MALE, GENDER.FEMALE, GENDER.TRANS],
        allowNull: true
      }
      // first_name: {
      //
      // },
      // middle_name: {},
      // last_name: {},
      // address: {},
      // qualifications: {},
      // activated_on: {},
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(DB_TABLES.DOCTORS);
  }
};
