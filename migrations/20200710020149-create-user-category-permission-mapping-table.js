"use strict";

import { USER_CATEGORY } from "../constant";
import { TABLE_NAME } from "../app/models/userCategoryPermissions";
import { TABLE_NAME as permissionTableName } from "../app/models/permissions";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      category: {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.ADMIN,
          USER_CATEGORY.CARE_TAKER,
          USER_CATEGORY.PROVIDER
        ]
      },
      permission_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: permissionTableName
          },
          key: "id"
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
    return queryInterface.dropTable(TABLE_NAME);
  }
};
