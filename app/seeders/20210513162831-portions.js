"use strict";

import { TABLE_NAME } from "../models/portions";

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "Cup",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Glass",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Tablespoon",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Teaspoon",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Ounce",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Scoop",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "g",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "l",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Bowl",
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
