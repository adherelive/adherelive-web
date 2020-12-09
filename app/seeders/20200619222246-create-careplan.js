'use strict';

import {TABLE_NAME} from "../models/carePlan";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        patient_id: 1,
        doctor_id: 1,
        care_plan_template_id: null,
        details: JSON.stringify({
          treatment_id: 1,
          severity_id: 1,
          condition_id: 1
        }),
        activated_on: new Date(),
        renew_on: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        patient_id: 2,
        doctor_id: 1,
        care_plan_template_id: null,
        details: JSON.stringify({
          treatment_id: 2,
        }),
        activated_on: new Date(),
        renew_on: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        patient_id: 3,
        doctor_id: 2,
        care_plan_template_id: null,
        details: JSON.stringify({
          treatment_id: 1,
          severity_id: 2,
          condition_id: 5
        }),
        activated_on: new Date(),
        renew_on: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        patient_id: 1,
        doctor_id: 2,
        care_plan_template_id: null,
        details: JSON.stringify({
          treatment_id: 3,
        }),
        activated_on: new Date(),
        renew_on: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        patient_id: 4,
        doctor_id: 1,
        care_plan_template_id: null,
        details: JSON.stringify({
          treatment_id: 1,
          condition_id: 7
        }),
        activated_on: new Date(),
        renew_on: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
