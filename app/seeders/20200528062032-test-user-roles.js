"use strict";

import {TABLE_NAME} from "../models/userRoles";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        user_identity: 1,
        linked_with: "doctor",
        linked_id: 1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 2,
        linked_with: "patient",
        linked_id: 2,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 3,
        linked_with: "doctor",
        linked_id: 3,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 4,
        linked_with: "admin",
        linked_id: 4,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 5,
        linked_with: "provider",
        linked_id: 5,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 6,
        linked_with: "patient",
        linked_id: 6,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 7,
        linked_with: "patient",
        linked_id: 7,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 8,
        linked_with: "patient",
        linked_id: 8,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_identity: 9,
        linked_with: "patient",
        linked_id: 9,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
