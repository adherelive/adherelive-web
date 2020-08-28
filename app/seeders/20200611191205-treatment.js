'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.bulkInsert(DB_TABLES.TREATMENTS, [
          {
              name: "Medication",
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: "Surgery",
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: "Hip Replacement",
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: "Chemotherapy",
              created_at: new Date(),
              updated_at: new Date()
          },
          {
              name: "Saline",
              created_at: new Date(),
              updated_at: new Date()
          }
      ]);
  },

  down: (queryInterface, Sequelize) => {
      return queryInterface.bulkDelete(DB_TABLES.TREATMENTS, null, {});
  }
};
