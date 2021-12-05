"use strict";

import {TABLE_NAME} from "../app/models/workout";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "expired_on", {
        type: Sequelize.DATE,
      }),
    ]);
  },
  
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.removeColumn(TABLE_NAME, "expired_on")]);
  },
};
