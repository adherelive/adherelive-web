"use strict";

import { TABLE_NAME } from "../models/course";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "M.CH. Paediatrics Surgery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D. M. Cardiology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Nephrology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Urology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Cardio Vascular & Thoracic Surgery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Critical Care Medicine",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Cardio Vascular &",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Medical Oncology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Neurology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Plastic &",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Hepatology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Neurosurgery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Endocrinology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Plastic & Reconstructive Surgery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Medical Genetics",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Gynecological",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Head & Neck Surgery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Medical Gastroenterology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Surgical Oncology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Neonatology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Virology",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "M.CH. Vascular Surgery",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D.M. Cardiac Anaesthesia",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "D. M. Clinical Pharmacology",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
