'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.COLLEGE, [
      {
        name: "Test College One",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Test College Two",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.COLLEGE, null, {});
  }
};
