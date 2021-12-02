"use strict";

import { TABLE_NAME } from "../models/specialities";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "Anaesthesia",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Anatomy:",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Biochemistry",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Community Medicine/PSM",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Dermatology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "ENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Family Medicine",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Forensic Medicine",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "General Medicine",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "General Surgery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Microbiology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Nuclear Medicine",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Orthopaedics",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Ophthalmology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Obs & Gynaecology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Palliative Medicine",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Pathology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Pharmacology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Physiology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Paediatrics",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Psychiatry",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Pulmonology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Radio Diagnosis",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Radiotherapy",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Tropical",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
