'use strict';

import {ACTION_TYPE, DB_TABLES} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(DB_TABLES.ACTIONS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      care_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.CARE_PLANS,
          },
          key: 'id'
        }
      },
      type: {
        type: Sequelize.ENUM,
        values: [ACTION_TYPE.MEDICATION, ACTION_TYPE.EXERCISE, ACTION_TYPE.DIET],
        allowNull: false
      },
      frequency_per_day: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      reference_link: {
        type: Sequelize.STRING(1000),
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
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
    return queryInterface.dropTable(DB_TABLES.ACTIONS);
  }
};
