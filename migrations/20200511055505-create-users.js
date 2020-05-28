"use strict";

import { DB_TABLES } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.USERS, {
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
        allowNull: false
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
    return queryInterface.dropTable(DB_TABLES.USERS);
  }
};

// exports.down = function(db, callback) {
//   db.dropTable(DB_TABLES.USERS, callback);
// };
