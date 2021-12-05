"use strict";

import {TABLE_NAME} from "../app/models/medicines";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, "public_medicine", {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
    });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, "public_medicine");
  },
};
