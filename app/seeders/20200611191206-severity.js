'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.SEVERITY, [
      {
        name: "High",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Medium",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.SEVERITY, null, {});
  }
};
