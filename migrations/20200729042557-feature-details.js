'use strict';

import {DB_TABLES, FEATURE_TYPE} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.FEATURE_DETAILS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      feature_type: {
        type: Sequelize.ENUM,
        values: [FEATURE_TYPE.APPOINTMENT, FEATURE_TYPE.MEDICATION]
      },
      details: {
        type: Sequelize.JSON,
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
    return queryInterface.dropTable(DB_TABLES.FEATURE_DETAILS);
  }
};
