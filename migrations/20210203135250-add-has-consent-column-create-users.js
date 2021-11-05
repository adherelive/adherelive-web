"use strict";

import { TABLE_NAME } from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "has_consent", {
        type: Sequelize.INTEGER,
        defaultValue: false,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "has_consent"),
    ]);
  },
};
