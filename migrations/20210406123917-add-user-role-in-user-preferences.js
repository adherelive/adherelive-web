"use strict";

import { TABLE_NAME } from "../app/models/userPreferences";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "user_role_id", {
        type: Sequelize.INTEGER,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "user_role_id"),
    ]);
  },
};
