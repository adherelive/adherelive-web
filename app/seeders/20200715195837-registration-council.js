'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.REGISTRATION_COUNCIL, [
      {
        name: "I.C.M.R.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "F.D.A.",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.REGISTRATION_COUNCIL, null, {});
  }
};
