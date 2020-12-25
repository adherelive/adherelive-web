'use strict';

import {TABLE_NAME} from "../models/registrationCouncil";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "I.C.M.R.",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "F.D.A.",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
