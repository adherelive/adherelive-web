'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
   
   return queryInterface.bulkInsert(DB_TABLES.CARE_PLAN_TEMPLATE, [
    {
      id: 1,
      type: 'Sample Care Plan',
      severity: 'High',
      condition: 'Critical',
      created_at: new Date(),
      updated_at: new Date(),
    },
]);
  },

  down: (queryInterface, Sequelize) => {
  
   return queryInterface.bulkDelete(DB_TABLES.CARE_PLAN_TEMPLATE, null, {});
  }
};
