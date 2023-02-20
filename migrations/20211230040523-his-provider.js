"use strict";
import { TABLE_NAME } from "../app/models/his";
import { TABLE_NAME as providersTableName } from "../app/models/providers";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      his_username: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      his_password: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      his_client_id: {
        type: Sequelize.STRING,
        unique: true,
        allowNull: false,
      },
      his_client_secret: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: providersTableName,
          },
          key: "id",
        },
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
