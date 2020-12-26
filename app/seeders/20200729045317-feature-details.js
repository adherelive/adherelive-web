"use strict";

import { FEATURE_TYPE, REPEAT_INTERVAL } from "../../constant";
import { TABLE_NAME } from "../models/featureDetails";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
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
            }
          },
          type_description: {
            "1": [
              "Blood test",
              "Urine tests",
              "COMPLETE BLOOD COUNT",
              "Liver Function Tests (LFT)",
              "Imaging tests",
              "Kidney Biopsy",
              "KIDNEY FUNCTION TEST",
              "Lipid profile (Cholesterol and triglycerides)",
              "BLOOD SUGAR TEST",
              "HbA1c Blood Test",
              "CARDIAC BLOOD TESTS",
              "THYROID FUNCTION TEST",
              "Blood Tests for Infertility",
              "SEMAN ANALYSIS",
              "Tumor marker",
              "BLOOD TEST FOR ARTHRITIS",
              "WIDAL TEST",
              "Dengue Serology",
              "Chikungunya",
              "HIV -1 & HIV-2"
            ],
            "2": ["At Clinic", "At Home", "Telephone"],
            "3": ["MRI", "CT Scan", "Ultrasound", "X-Ray"]
          },
          providers: {
            "1": {
              basic_info: {
                id: 1,
                name: "Apollo Hospitals",
                address: null,
                city: null,
                state: null
              }
            },
            "2": {
              basic_info: {
                id: 2,
                name: "Columbia Asia",
                address: null,
                city: null,
                state: null
              }
            },
            "3": {
              basic_info: {
                id: 3,
                name: "Fortis Hospitals",
                address: null,
                city: null,
                state: null
              }
            },
            "4": {
              basic_info: {
                id: 4,
                name: "Self",
                address: null,
                city: null,
                state: null
              }
            }
          }
        }),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        feature_type: FEATURE_TYPE.MEDICATION,
        details: JSON.stringify({}),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        feature_type: FEATURE_TYPE.VITAL,
        details: JSON.stringify({
          repeat_interval_ids: ["1", "2", "3", "4", "5", "6"],
          repeat_intervals: {
            1: {
              text: "Once",
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
          }
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
