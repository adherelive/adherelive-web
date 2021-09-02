"use strict";

import { TABLE_NAME } from "../models/treatments";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
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
        name: "Diet & Nutrition",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Exercise & Lifestyle",
        created_at: new Date(),
        updated_at: new Date()
      }
      // {
      //     name: "Saline",
      //     created_at: new Date(),
      //     updated_at: new Date()
      // }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
