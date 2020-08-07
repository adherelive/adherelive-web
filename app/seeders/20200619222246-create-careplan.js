'use strict';

import { DB_TABLES } from "../../constant";

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
    return queryInterface.bulkInsert(DB_TABLES.CARE_PLANS, [
      {
        patient_id: 1,
        doctor_id: 1,
        care_plan_template_id: 1,
        details: JSON.stringify({
          treatment_id: 1,
          severity_id: 1,
          condition_id: 1
        }),
        activated_on: new Date(),
        renew_on: new Date(),
        expired_on: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete(DB_TABLES.CARE_PLANS, null, {});
  }
};
