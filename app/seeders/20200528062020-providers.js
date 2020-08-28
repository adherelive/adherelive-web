'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.PROVIDERS, [
      {
        name: "Apollo Hospitals",
        created_at:new Date(),
        updated_at: new Date()
      },
      {
        name: "Columbia Asia",
        created_at:new Date(),
        updated_at: new Date()
      },
      {
        name: "Fortis Hospitals",
        created_at:new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.PROVIDERS, null, {});
  }
};
