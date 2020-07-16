'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.COURSE, [
      {
        name: "Test Course One",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Test Course Two",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.COURSE, null, {});
  }
};
