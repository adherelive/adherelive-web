'use strict';

import {TABLE_NAME} from "../models/userPreferences";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
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
      {
        user_id: "2",
        details: JSON.stringify({
          timings: {
            "1":{
              "value":"2020-09-24T08:00:00+05:30"
            },
            "2":{
              "value":"2020-09-24T09:00:00+05:30"
            },
            "3":{
              "value":"2020-09-24T13:00:00+05:30"
            },
            "4":{
              "value":"2020-09-24T16:00:00+05:30"
            },
            "5":{
              "value":"2020-09-24T20:00:00+05:30"
            },
            "6":{
              "value":"2020-09-24T23:00:00+05:30"
            }
          }
        }),
        created_at: new Date(),
        updated_at: new Date(),
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
