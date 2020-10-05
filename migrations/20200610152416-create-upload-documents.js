'use strict';

import {TABLE_NAME} from "../app/models/uploadDocuments";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
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
      name: {
        type: Sequelize.STRING(1000)
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
