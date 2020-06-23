'use strict';

import {DB_TABLES} from "../../constant";
import bcrypt from "bcrypt";

let password = "";

// const a = await bcrypt.hash("Password@123", 5);

module.exports = {
    up: async (queryInterface, Sequelize) => {
        /*
          Add altering commands here.google
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
                verified:1,
                onboarded:1,
                mobile_number: "1234567890",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_name: "patientOne",
                email: "test-patient@mail.com",
                password: await bcrypt.hash("Password@123", 5),
                sign_in_type: "basic",
                category: "patient",
                verified:1,
                onboarded:1,
                mobile_number: "9234623472",
                activated_on: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_name: "doctorTwo",
                email: "test-doctor-two@mail.com",
                password: await bcrypt.hash("Password@123", 5),
                sign_in_type: "google",
                category: "doctor",
                verified:1,
                onboarded:1,
                mobile_number: "2383548292",
                activated_on: new Date(),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_name: "Admin",
                email:"admin@mail.com",
                password: await bcrypt.hash("Password@123", 5),
                sign_in_type: "basic",
                category: "admin",
                verified:1,
                onboarded:1,
                mobile_number: "1234567890",
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
