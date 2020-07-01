'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {

   return queryInterface.bulkInsert(DB_TABLES.CARE_PLAN_TEMPLATE, [
    {
      id: 1,
      name: 'Sample Care Plan',
        treatment_id: '1',
      severity_id: '1',
      condition_id: '1',
      created_at: new Date(),
      updated_at: new Date(),
    },
]);
  },

  down: (queryInterface, Sequelize) => {

   return queryInterface.bulkDelete(DB_TABLES.CARE_PLAN_TEMPLATE, null, {});
  }
};
