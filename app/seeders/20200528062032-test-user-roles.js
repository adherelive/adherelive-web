"use strict";

import { TABLE_NAME } from "../models/userRoles";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        user_identity: 1,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 2,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 3,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 4,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 5,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 6,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 7,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 8,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_identity: 9,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
