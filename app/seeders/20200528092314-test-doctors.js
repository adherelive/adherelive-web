'use strict';

import {DB_TABLES} from "../../constant";
import bcrypt from "bcrypt";

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.bulkInsert('People', [{
            name: 'John Doe',
            isBetaMember: false
          }], {});
        */
        return queryInterface.bulkInsert(DB_TABLES.DOCTORS, [
            {
                user_id: "1",
                gender: "m",
                first_name: "John",
                last_name: "Doe",
                city: "delhi",
                speciality_id:"1",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                user_id: "3",
                gender: "m",
                first_name: "google",
                last_name: "user",
                city: "delhi",
                speciality_id:"2",
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
        return queryInterface.bulkDelete(DB_TABLES.DOCTORS, null, {});
    }
};
