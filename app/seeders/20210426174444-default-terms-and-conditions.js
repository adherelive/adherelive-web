"use strict";

import { TABLE_NAME } from "../models/termsAndConditions";
import { TERMS_AND_CONDITIONS_TYPES } from "../../constant";

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        id: 1,
        terms_type: TERMS_AND_CONDITIONS_TYPES.DEFAULT_TERMS_OF_PAYMENT,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        id: 2,
        terms_type: TERMS_AND_CONDITIONS_TYPES.TERMS_OF_PAYMENT,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
