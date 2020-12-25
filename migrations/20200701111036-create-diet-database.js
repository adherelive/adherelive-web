'use strict';

import {DB_TABLES} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.DIET, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      action_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.ACTIONS,
          },
          key: 'id'
        }
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false
      },
      description: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      condition: {
        type: Sequelize.STRING,
        allowNull: false
      },
      default_frequency: {
        type: Sequelize.STRING,
        allowNull: false
      },
      restriction_age: {
        type: Sequelize.STRING,
        allowNull: false
      },
      content_reference: {
        type: Sequelize.STRING,
        allowNull: false
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
    return queryInterface.dropTable(DB_TABLES.DIET);
  }
};
