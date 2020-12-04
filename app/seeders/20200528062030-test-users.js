"use strict";

import { TABLE_NAME } from "../models/users";
import bcrypt from "bcrypt";

let password = "";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        user_name: "doctorOne",
        email: "test-doctor@mail.com",
        password: await bcrypt.hash("Password@123", 5),
        sign_in_type: "basic",
        category: "doctor",
        verified: 1,
        onboarded: 1,
        onboarding_status: "CLINIC_registered",
        mobile_number: "1234567890",
        prefix: "91",
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
        verified: 1,
        onboarded: 1,
        mobile_number: "123456",
        prefix: "91",
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
        verified: 1,
        onboarded: 1,
        onboarding_status: "CLINIC_registered",
        mobile_number: "2383548292",
        prefix: "91",
        activated_on: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_name: "Admin",
        email: "admin@mail.com",
        password: await bcrypt.hash("Password@123", 5),
        sign_in_type: "basic",
        category: "admin",
        verified: 1,
        onboarded: 1,
        mobile_number: "12345678900",
        prefix: "91",
        activated_on: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        user_name: "Provider",
        email: "test-provider@mail.com",
        password: await bcrypt.hash("Password@123", 5),
        sign_in_type: "basic",
        category: "provider",
        verified: 1,
        onboarded: 1,
        mobile_number: "9999888800",
        prefix: "91",
        activated_on: new Date(),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
