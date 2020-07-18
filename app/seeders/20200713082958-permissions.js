'use strict';
import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.PERMISSIONS, [
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
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.PERMISSIONS, null, {});
  }
};
