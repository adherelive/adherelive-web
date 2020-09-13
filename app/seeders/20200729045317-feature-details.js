'use strict';

import {DB_TABLES, FEATURE_TYPE, REPEAT_INTERVAL} from "../../constant";

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
      },
      {
        feature_type: FEATURE_TYPE.VITAL,
        details: JSON.stringify({
          repeat_interval_ids: ["1","2","3","4", "5", "6"],
          repeat_intervals: {
            1: {
              text:"Once",
              unit: "h",
              value: 0,
              key: REPEAT_INTERVAL.ONCE
            },
            2: {
              text: "Every hour",
              unit: "h",
              value: 1,
              key: REPEAT_INTERVAL.ONE_HOUR
            },
            3: {
              text: "Every 2 hour",
              unit: "h",
              value: 2,
              key: REPEAT_INTERVAL.TWO_HOUR
            },
            4: {
              text: "Every 4 hour",
              unit: "h",
              value: 4,
              key: REPEAT_INTERVAL.FOUR_HOUR
            },
            5: {
              text: "Every 6 hour",
              unit: "h",
              value: 6,
              key: REPEAT_INTERVAL.SIX_HOUR
            },
            6: {
              text: "Every 12 hour",
              unit: "h",
              value: 12,
              key: REPEAT_INTERVAL.TWELVE_HOUR
            }
          },
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
