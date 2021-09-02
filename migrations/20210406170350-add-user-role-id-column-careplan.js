"use strict";

import { TABLE_NAME } from "../app/models/carePlan";
import { TABLE_NAME as userRoleTableName } from "../app/models/userRoles";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, "user_role_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: {
          tableName: userRoleTableName
        },
        key: "id"
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, "user_role_id");
  }
};
