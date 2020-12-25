"use strict";

import {TABLE_NAME} from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: true
      },
      prefix: {
        type: Sequelize.STRING,
        allowNull: true
      },
      mobile_number: {
        type: Sequelize.STRING,
        allowNull: true
      },
      password: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      sign_in_type: {
        type: Sequelize.ENUM,
        values: ["basic", "google", "facebook"],
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM,
        values: ["patient", "care_taker", "doctor", "provider", "admin"],
        allowNull: false
      },
      activated_on: {
        type: Sequelize.DATE
      },
      onboarded: {
        type: Sequelize.BOOLEAN
      },
      onboarding_status: {
        type: Sequelize.STRING,
        allowNull:true
      },
      verified: {
        type: Sequelize.BOOLEAN,
        defaultValue:false
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
    return queryInterface.dropTable(TABLE_NAME);
  }
};

