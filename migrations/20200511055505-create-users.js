"use strict";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable("Users", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_name: {
        type: Sequelize.STRING
      },
      category: {
        type: Sequelize.ENUM(
          "patient",
          "care_taker",
          "doctor",
          "provider",
          "admin"
        ),
        allowNull: false
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sign_in_type: {
        type: Sequelize.ENUM("basic", "google", "facebook"),
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      activated_on: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("Users");
  }
};
