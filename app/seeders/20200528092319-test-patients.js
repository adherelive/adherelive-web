"use strict";

import { TABLE_NAME } from "../models/patients";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        user_id: "2",
        gender: "m",
        age: "40 y",
        first_name: "Gagneet",
        last_name: "Singh",
        address: "NOIDA",
        dob: "1980-07-23 05:20:23",
        details: JSON.stringify({
          allergies: "Pollen Allergies",
          comorbidities: "Thyroid",
        }),
        uid: `ADH/${new Date().getFullYear()}/0005`,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: "6",
        gender: "m",
        age: "35 y",
        first_name: "Ankur",
        last_name: "Agrawal",
        address: "New Delhi",
        dob: "1986-10-01 10:25:01",
        details: JSON.stringify({
          allergies: "No Allergies",
          comorbidities: "Comorbidities A",
        }),
        uid: `ADH/${new Date().getFullYear()}/0001`,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: "7",
        gender: "f",
        age: "30 y",
        first_name: "Sagar",
        last_name: "Agrawal",
        address: "Gurgaon",
        dob: "1991-05-15 09:00:00",
        details: JSON.stringify({
          allergies: "No Allergies",
          comorbidities: "Comorbidities B",
        }),
        uid: `ADH/${new Date().getFullYear()}/0002`,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: "8",
        gender: "m",
        age: "45 y",
        first_name: "Vasudevan Srinivasan",
        last_name: "Four",
        address: "Chennai",
        dob: "1976-02-10 14:35:15",
        details: JSON.stringify({
          allergies: "No Allergies",
          comorbidities: "Comorbidities C",
        }),
        uid: `ADH/${new Date().getFullYear()}/0003`,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id: "9",
        gender: "f",
        age: "25 y",
        first_name: "Avneet",
        last_name: "Rooprai",
        address: "New Delhi",
        dob: "1996-08-16 19:10:25",
        details: JSON.stringify({
          allergies: "No Allergies",
          comorbidities: "Comorbidities D",
        }),
        uid: `ADH/${new Date().getFullYear()}/0004`,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
