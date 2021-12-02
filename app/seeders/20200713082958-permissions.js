"use strict";

import { TABLE_NAME } from "../models/permissions";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        type: "VERIFIED_ACCOUNT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DELETE_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "TEMPLATE_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_APPOINTMENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_CALENDAR_SCHEDULE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_CALENDER",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_CARE_PLAN",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_CARE_PLAN",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_CARE_PLAN",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_CARE_PLAN_TEMPLATE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DELETE_CARE_PLAN_TEMPLATE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DUPLICATE_CARE_PLAN_TEMPLATE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_CARE_PLAN_TEMPLATE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_CARE_PLAN_TEMPLATE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_DIET",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DELETE_DIET",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "TEMPLATE_DIET",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_DIET",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_DIET",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_DOCTOR",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_DOCTOR",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_DOCTOR",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_DOCTOR",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_GRAPH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_GRAPH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_GRAPH",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DELETE_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "EDIT_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "TEMPLATE_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_PATIENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_PATIENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_PATIENT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_PAYMENT_PRODUCT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_PAYMENT_PRODUCT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_PROFILE",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_REPORT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DELETE_REPORT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_REPORT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_REPORT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_VITAL",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DELETE_VITAL",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "TEMPLATE_VITAL",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_VITAL",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_VITAL",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "ADD_WORKOUT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "DELETE_WORKOUT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "TEMPLATE_WORKOUT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "UPDATE_WORKOUT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_WORKOUT",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        type: "VIEW_TIMELINE_MEDICATION",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
