'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkInsert('People', [{
        name: 'John Doe',
        isBetaMember: false
      }], {});
    */
    return queryInterface.bulkInsert(DB_TABLES.PATIENTS, [{
      user_id: "2",
      gender: "m",
      age:"25 y",
      first_name: "Atish",
      last_name:"Kumar",
      address:"delhi",
      dob:"1994-09-02 12:05:21",
      uid: `ADH/${new Date().getFullYear()}/0001`,
      created_at: new Date(),
      updated_at: new Date()
    }]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete(DB_TABLES.PATIENTS, null, {});
  }
};
