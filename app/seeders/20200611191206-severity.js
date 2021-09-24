"use strict";

import { TABLE_NAME } from "../models/severity";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "High",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Medium",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Low",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
