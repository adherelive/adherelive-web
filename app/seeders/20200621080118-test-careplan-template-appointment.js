"use strict";

import { TABLE_NAME } from "../models/templateAppointments";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        care_plan_template_id: 1,
        reason: "Checking of Vitals",
        time_gap: "14",
        provider_id: "1",
        details: JSON.stringify({
          description: "Please fast for 12 hours before the test",
          appointment_type: "1",
          type_description: "Blood Test",
          critical: false,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        care_plan_template_id: 1,
        reason: "Surgery",
        time_gap: "18",
        provider_id: "2",
        details: JSON.stringify({
          description: "We will do a checkup in the morning of the Surgery",
          appointment_type: "1",
          type_description: "Blood Test",
          critical: true,
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
