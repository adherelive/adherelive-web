"use strict";
import { TABLE_NAME } from "../app/models/scheduleEvents";
import { EVENT_TYPE } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(TABLE_NAME, "event_type", {
      type: Sequelize.ENUM,
      values: [
        EVENT_TYPE.APPOINTMENT,
        EVENT_TYPE.REMINDER,
        EVENT_TYPE.MEDICATION_REMINDER,
        EVENT_TYPE.VITALS,
        EVENT_TYPE.CARE_PLAN_ACTIVATION,
        EVENT_TYPE.DIET,
        EVENT_TYPE.WORKOUT
      ]
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(TABLE_NAME, "event_type", {
      type: Sequelize.ENUM,
      values: [
        EVENT_TYPE.APPOINTMENT,
        EVENT_TYPE.REMINDER,
        EVENT_TYPE.MEDICATION_REMINDER,
        EVENT_TYPE.VITALS,
        EVENT_TYPE.CARE_PLAN_ACTIVATION
      ]
    });
  }
};
