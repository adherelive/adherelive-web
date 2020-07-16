'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.QUALIFICATION, [
      {
        name: "Neurologist",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "ENT Specialist",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.QUALIFICATION, null, {});
  }
};
