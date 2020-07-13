'use strict';

import {DB_TABLES} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.USER_PREFERENCES, [
      {
        user_id: "1",
        details: JSON.stringify({
          charts: ["1","2","3","4"]
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        user_id:"3",
        details: JSON.stringify({
          charts: ["1","2","3","4"]
        }),
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.USER_PREFERENCES, null, {});
  }
};
