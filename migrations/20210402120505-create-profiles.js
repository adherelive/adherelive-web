"use strict";

import { TABLE_NAME } from "../app/models/profiles";

import { TABLE_NAME as userTableName } from "../app/models/users";
import { USER_CATEGORY} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                tableName: userTableName
                },
                key: "id"
            }
        },
        category_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        category_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.PROVIDER, USER_CATEGORY.ADMIN],
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
    return queryInterface.dropTable(TABLE_NAME);
  }
};
