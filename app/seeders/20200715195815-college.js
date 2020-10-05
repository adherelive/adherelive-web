'use strict';

import {TABLE_NAME} from "../models/college";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
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
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
