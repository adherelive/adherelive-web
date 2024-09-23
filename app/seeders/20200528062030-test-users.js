"use strict";

import { TABLE_NAME } from "../models/users";
import bcrypt from "bcrypt";

const generatePasswordHash = async (password) => {
  return await bcrypt.hash(password, 5);
};

const usersData = [
  {
    user_name: "Sparsh Jaiswal",
    email: "test-doctor@mail.com",
    category: "doctor",
    mobile_number: "8710087100",
  },
  {
    user_name: "Gagneet Singh",
    email: "gagneet.singh@gmail.com",
    category: "patient",
    mobile_number: "9810739699",
  },
  {
    user_name: "Vivek Asthana",
    email: "test-doctor2@mail.com",
    category: "doctor",
    mobile_number: "8710087102",
  },
  {
    user_name: "Administrator User",
    email: "admin@mail.com",
    category: "admin",
    mobile_number: "8710087101",
  },
  {
    user_name: "Provider Hospital",
    email: "test-provider@mail.com",
    category: "provider",
    mobile_number: "9876543215",
  },
  {
    user_name: "Ankur Agrawal",
    email: "test-patient2@mail.com",
    category: "patient",
    mobile_number: "9876543211",
  },
  {
    user_name: "Sagar Agrawal",
    email: "test-patient3@mail.com",
    category: "patient",
    mobile_number: "9876543212",
  },
  {
    user_name: "Vasudevan Srinivasan",
    email: "test-patient4@mail.com",
    category: "patient",
    mobile_number: "9876543213",
  },
  {
    user_name: "Avneet Rooprai",
    email: "test-patient5@mail.com",
    category: "patient",
    mobile_number: "9876543214",
  },
];

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const hashedUsersData = await Promise.all(
      usersData.map(async (user) => ({
        ...user,
        password: await generatePasswordHash("Password@123"),
        sign_in_type: "basic",
        verified: 1,
        onboarded: 1,
        onboarding_status:
          user.category === "doctor" ? "CLINIC_registered" : undefined,
        prefix: "91",
        activated_on: new Date(),
        created_at: new Date(),
        updated_at: new Date(),
      }))
    );

    try {
      return await queryInterface.bulkInsert(TABLE_NAME, hashedUsersData);
    } catch (error) {
      console.error("Error seeding users:", error);
    }
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
