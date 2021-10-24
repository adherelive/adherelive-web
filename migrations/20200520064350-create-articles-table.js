"use strict";

import { DB_TABLES, ARTICLE_TYPE } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
                  Add altering commands here.
                  Return a promise to correctly handle asynchronicity.

                  Example:
                  return queryInterface.createTable('users', { id: Sequelize.INTEGER });
                */
    return queryInterface.createTable(DB_TABLES.ARTICLES, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      type: {
        type: Sequelize.ENUM,
        values: [ARTICLE_TYPE.VIDEO, ARTICLE_TYPE.IMAGE, ARTICLE_TYPE.PDF]
      },
      description: {
        type: Sequelize.STRING(1000)
      },
      url: {
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
    /*
                  Add reverting commands here.
                  Return a promise to correctly handle asynchronicity.

                  Example:
                  return queryInterface.dropTable('users');
                */
    return queryInterface.dropTable(DB_TABLES.ARTICLES);
  }
};
