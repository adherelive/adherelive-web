'use strict';

import {DB_TABLES, USER_CATEGORY} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.USER_CATEGORY_PERMISSIONS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.ENUM,
        values: [USER_CATEGORY.PATIENT, USER_CATEGORY.DOCTOR, USER_CATEGORY.ADMIN, USER_CATEGORY.CARE_TAKER, USER_CATEGORY.PROVIDER],
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.PERMISSIONS,
          },
          key: 'id'
        }
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
    return queryInterface.dropTable(DB_TABLES.PERMISSIONS);
  }
};
