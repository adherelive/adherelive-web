'use strict';

import {TABLE_NAME} from "../models/specialities";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "Anaesthesia",
        created_at:new Date(),
        updated_at: new Date()
      },
      {
        name: "Cardiology - Non Interventional",
        created_at:new Date(),
        updated_at: new Date()
      },
      {
        name: "Cardiology - Interventional",
        created_at:new Date(),
        updated_at: new Date()
      },
      {
        name: "General Surgery",
        created_at:new Date(),
        updated_at: new Date()
      },
      {
        name: "Nutrition & Dietetics",
        created_at:new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
