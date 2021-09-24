"use strict";

import { DB_TABLES } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
              Add altering commands here.
              Return a promise to correctly handle asynchronicity.

              Example:
              return queryInterface.createTable('users', { id: Sequelize.INTEGER });
            */
    return queryInterface.createTable(DB_TABLES.DISEASE, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      description: {
        type: Sequelize.STRING(1000),
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
    return queryInterface.dropTable(DB_TABLES.DISEASE);
  }
};
