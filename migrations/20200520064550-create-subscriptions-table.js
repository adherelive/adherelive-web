'use strict';

import {DB_TABLES, USER_CATEGORY} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(DB_TABLES.SUBSCRIPTIONS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      product_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.PRODUCT_PLANS,
          },
          key: 'id'
        }
      },
      subscriber_type: {
        type: Sequelize.ENUM,
        values: [USER_CATEGORY.PATIENT],
        allowNull: false
      },
      subscriber_id: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      activated_on: {
        type: Sequelize.DATE
      },
      renew_on: {
        type: Sequelize.DATE
      },
      expired_on: {
        type: Sequelize.DATE,
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable(DB_TABLES.SUBSCRIPTIONS);
  }
};
