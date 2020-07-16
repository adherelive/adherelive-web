'use strict';

import { DB_TABLES } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.UPLOAD_DOCUMENTS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parent_type: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      parent_id:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      document: {
        type: Sequelize.STRING(1000),
        allowNull: false,
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
    return queryInterface.dropTable(DB_TABLES.UPLOAD_DOCUMENTS);
  }
};
