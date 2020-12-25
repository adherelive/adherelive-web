'use strict';

import {TABLE_NAME} from "../models/providers";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
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
      {
        name: "Self",
        created_at:new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
