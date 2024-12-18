"use strict";

import { TABLE_NAME } from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
    // TODO: Remove the comments on these lines, if his_id works
    //       Currently it gives an error
    return queryInterface.addColumn(TABLE_NAME, "his_id", {
      type: Sequelize.INTEGER,
      allowNull: true,
      defaultValue: null,
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, "his_id");
  },
};
