'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.DEGREE, [
      {
        name: "M.D.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.B.B.S.",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.DEGREE, null, {});
  }
};
