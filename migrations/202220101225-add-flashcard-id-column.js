"use strict";

import { TABLE_NAME } from "../app/models/reports";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "flash_card_id", {
        type: Sequelize.INTEGER,
        allowNull: true,
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "flash_card_id"),
    ]);
  },
};
