'use strict';

import {TABLE_NAME} from "../models/patients";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [{
      user_id: "2",
      gender: "m",
      age:"25 y",
      first_name: "Atish",
      last_name:"Kumar",
      address:"delhi",
      dob:"1994-09-02 12:05:21",
      details: JSON.stringify({allergies: "some allergies", comorbidities: "some comorbidities"}),
      uid: `ADH/${new Date().getFullYear()}/0001`,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
