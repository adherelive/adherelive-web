"use strict";

import { DB_TABLES } from "../../constant";

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
    return queryInterface.bulkInsert(DB_TABLES.MEDICINES, [
      {
        name: "Amoxil 2mg",
        type: "tablet",
        description: "",
        pillbox_id:1,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Amoxil 4mg",
        type: "tablet",
        description: "",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Insulin",
        type: "injection",
        description: "",
        pillbox_id:1,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('People', null, {});
    */
    return queryInterface.bulkDelete(DB_TABLES.MEDICINES, null, {});
  },
};
