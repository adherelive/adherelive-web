"use strict";

import { TABLE_NAME } from "../app/models/registrationCouncil";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, "user_created", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, "user_created");
  }
};
