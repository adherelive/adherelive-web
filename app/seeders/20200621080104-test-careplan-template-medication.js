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
   return queryInterface.bulkInsert(DB_TABLES.TEMPLATE_MEDICATIONS, [
    {
      id:1,
      care_plan_template_id:1,
      medicine_id:1,
      schedule_data:JSON.stringify({'frequency':'Everyday twice after meals'}),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id:2,
      care_plan_template_id:1,
      medicine_id:2,
      schedule_data:JSON.stringify({"frequency":'Once every Tuesday at 10am'}),
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
   return queryInterface.bulkDelete(DB_TABLES.TEMPLATE_MEDICATIONS, null, {});
  }
};
