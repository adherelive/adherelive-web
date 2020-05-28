'use strict';

import {DB_TABLES} from "../../constant";
import bcrypt from "bcrypt";

let password = "";

// const a = await bcrypt.hash("Password@123", 5);

module.exports = {
    up: async (queryInterface, Sequelize) => {
        password
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
        return queryInterface.bulkInsert(DB_TABLES.USERS, [
            {
                user_name: "doctorOne",
                email: "test-doctor@mail.com",
                password: await bcrypt.hash("Password@123", 5),
                sign_in_type: "basic",
                category: "doctor",
                activated_on: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_name: "patientOne",
                email: "test-patient@mail.com",
                password: await bcrypt.hash("Password@123", 5),
                sign_in_type: "basic",
                category: "patient",
                activated_on: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkDelete('People', null, {});
        */
        return queryInterface.bulkDelete(DB_TABLES.USERS, null, {});
    }
};
