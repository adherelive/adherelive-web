"use strict";

import {TABLE_NAME} from "../app/models/patients";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "payment_terms_accepted", {
        type: Sequelize.INTEGER,
        defaultValue: false,
      }),
    ]);
  },
  
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "payment_terms_accepted"),
    ]);
  },
};
