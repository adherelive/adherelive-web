'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.COLLEGE, [
      {
        name: "MAULANA AZAD MEDICAL COLL., N.DELHI",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Seth Gordhandas Sunderdas Medical College, Mumbai",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "B.J. Medical College, Ahmedabad",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "V.M.M.C. and S.J. HOSPITAL. New Delhi",
        created_at: new Date(),
        updated_at: new Date(),
      },{
        name: "Bangalore Medical College, Bangalore",
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.COLLEGE, null, {});
  }
};
