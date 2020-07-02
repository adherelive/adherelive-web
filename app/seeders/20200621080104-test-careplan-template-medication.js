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
    return queryInterface.bulkInsert(DB_TABLES.TEMPLATE_MEDICATIONS, [
      {
        id: 1,
        care_plan_template_id: 1,
        medicine_id: 1,
        schedule_data: JSON.stringify({ "unit": "mg", "repeat": "weekly", "quantity": 1, "strength": 2, "medicine_id": "1", "repeat_days": ["Mon", "Fri"], "when_to_take": ["6"], "repeat_interval": 0, "medication_stage": "", "duration": 5 }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        id: 2,
        care_plan_template_id: 1,
        medicine_id: 7,
        schedule_data: JSON.stringify({ "unit": "ml", "repeat": "weekly", "quantity": 1, "strength": 5, "medicine_id": "3", "repeat_days": ["Sun", "Thu", "Tue"], "when_to_take": ["4"], "repeat_interval": 0, "medication_stage": "", "duration": 6 }),
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
