"use strict";

import {TABLE_NAME} from "../models/doctors";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        user_id: "1",
        gender: "m",
        first_name: "Sparch",
        last_name: "Jaiswal",
        city: "New Delhi",
        speciality_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: "3",
        gender: "m",
        first_name: "Vivek",
        last_name: "Asthana",
        city: "Meerut",
        speciality_id: "2",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
