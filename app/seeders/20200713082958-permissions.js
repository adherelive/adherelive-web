"use strict";

import { TABLE_NAME } from "../models/permissions";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        type: "VERIFIED_ACCOUNT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_PATIENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_PATIENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_GRAPH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_CAREPLAN",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_DOCTOR",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_DOCTOR",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_PAYMENT_PRODUCT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_PAYMENT_PRODUCT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_CALENDAR_SCHEDULE",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
