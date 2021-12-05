"use strict";

import {TABLE_NAME} from "../app/models/scheduleEvents";
import {EVENT_STATUS} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "status", {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          EVENT_STATUS.SCHEDULED,
          EVENT_STATUS.PENDING,
          EVENT_STATUS.COMPLETED,
          EVENT_STATUS.EXPIRED,
          EVENT_STATUS.CANCELLED,
          EVENT_STATUS.STARTED,
          EVENT_STATUS.PRIOR,
        ],
        defaultValue: EVENT_STATUS.PENDING,
      }),
    ]);
  },
  
  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.changeColumn(TABLE_NAME, "status")]);
  },
};
