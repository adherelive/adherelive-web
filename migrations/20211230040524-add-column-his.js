"use strict";

import { TABLE_NAME } from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
    // return queryInterface.addColumn(TABLE_NAME, "his_id", {
    //   type: Sequelize.INTEGER,
    //   allowNull: true,
    //   defaultValue: null,
    // });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, "his_id");
  },
};
