'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    
   return queryInterface.bulkInsert(DB_TABLES.TEMPLATE_APPOINTMENTS, [
    {
      care_plan_template_id:1,
      reason:'Checking of Vitals',
      time_gap:'14',
        provider_id:"1",
      details:JSON.stringify({"description":'Please fast before 12 hours', appointment_type: "1",
          type_description:"Telephone"}),
      created_at: new Date(),
      updated_at: new Date(),
    },
    {
      care_plan_template_id:1,
      reason:'Surgery',
      time_gap:'18',
        provider_id:"2",
      details:JSON.stringify({'description':'We will do a checkup in the morning too.', appointment_type: "1",
          type_description:"Telephone"}),
      created_at: new Date(),
      updated_at: new Date(),
    },
]);
  },

  down: (queryInterface, Sequelize) => {
  
   return queryInterface.bulkDelete(DB_TABLES.TEMPLATE_APPOINTMENTS, null, {});
  }
};
