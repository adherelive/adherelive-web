'use strict';

import {DB_TABLES, FEATURE_TYPE} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.FEATURE_DETAILS, [
      {
        feature_type: FEATURE_TYPE.APPOINTMENT,
        details: JSON.stringify({
          appointment_type: {
            "1": {
              title: "Medical Tests"
            },
            "2": {
              title: "Consultation"
            },
            "3": {
              title: "Radiology"
            },
          },
          type_description: {
            "1": ["GGT","LFT","ESR","GST"],
            "2": ["At Clinic", "At Home", "Telephone"],
            "3": ["MRI", "CT Scan", "Ultrasound"]
          }
        }),
        created_at:new Date(),
        updated_at: new Date()
      },
      {
        feature_type: FEATURE_TYPE.MEDICATION,
        details: JSON.stringify({

        }),
        created_at:new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.FEATURE_DETAILS, null, {});
  }
};
