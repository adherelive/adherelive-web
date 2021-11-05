"use strict";

import { EVENT_STATUS, EVENT_TYPE } from "../constant";
import { TABLE_NAME } from "../app/models/scheduleEvents";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      critical: {
        type: Sequelize.BOOLEAN,
      },
      event_type: {
        type: Sequelize.ENUM,
        values: [
          EVENT_TYPE.APPOINTMENT,
          EVENT_TYPE.REMINDER,
          EVENT_TYPE.MEDICATION_REMINDER,
          EVENT_TYPE.VITALS,
          EVENT_TYPE.CARE_PLAN_ACTIVATION,
        ],
      },
      event_id: {
        type: Sequelize.INTEGER,
      },
      details: {
        type: Sequelize.JSON,
      },
      status: {
        type: Sequelize.ENUM,
        values: [
          EVENT_STATUS.SCHEDULED,
          EVENT_STATUS.PENDING,
          EVENT_STATUS.COMPLETED,
          EVENT_STATUS.EXPIRED,
          EVENT_STATUS.CANCELLED,
        ],
        defaultValue: EVENT_STATUS.PENDING,
      },
      date: {
        type: Sequelize.DATEONLY,
      },
      start_time: {
        type: Sequelize.DATE,
      },
      end_time: {
        type: Sequelize.DATE,
      },
      created_at: {
        type: Sequelize.DATE,
      },
      updated_at: {
        type: Sequelize.DATE,
      },
      deleted_at: {
        type: Sequelize.DATE,
        allowNull: true,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
