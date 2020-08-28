'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.TREATMENT_CONDITION_MAPPING, [
      {
        condition_id: "1",
        treatment_id: "1",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "1",
        treatment_id: "2",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "1",
        treatment_id: "3",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "2",
        treatment_id: "1",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "2",
        treatment_id: "4",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "3",
        treatment_id: "1",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "3",
        treatment_id: "2",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "3",
        treatment_id: "5",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "4",
        treatment_id: "1",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "4",
        treatment_id: "2",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "5",
        treatment_id: "1",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "5",
        treatment_id: "2",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "6",
        treatment_id: "1",
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        condition_id: "6",
        treatment_id: "2",
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.TREATMENT_CONDITION_MAPPING, null, {});
  }
};
