'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    
   return queryInterface.bulkInsert(DB_TABLES.TEMPLATE_APPOINTMENTS, [
    {
      id:1,
      care_plan_template_id:1,
      reason:'Checking of Vitals',
      time_gap:'two weeks',
      details:JSON.stringify({"notes":'Please fast before 12 hours'}),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      id:2,
      care_plan_template_id:1,
      reason:'Surgery',
      time_gap:'After 18 days',
      details:JSON.stringify({'notes':'We will do a checkup in the morning too.'}),
      created_at: new Date(),
      updated_at: new Date(),
    },
]);
  },

  down: (queryInterface, Sequelize) => {
  
   return queryInterface.bulkDelete(DB_TABLES.TEMPLATE_APPOINTMENTS, null, {});
  }
};
