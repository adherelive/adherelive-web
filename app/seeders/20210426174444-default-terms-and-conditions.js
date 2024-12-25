"use strict";

import { TABLE_NAME } from "../models/termsAndConditions";
import { TERMS_AND_CONDITIONS_TYPES } from "../../constant";

module.exports = {
  up: async (queryInterface) => {
    const existingEntries = await queryInterface.sequelize.query(
      `SELECT id FROM ${TABLE_NAME} WHERE id IN (1, 2);`
    );

    if (existingEntries[0].length === 0) {
      return queryInterface.bulkInsert(TABLE_NAME, [
        {
          id: 1,
          terms_type: TERMS_AND_CONDITIONS_TYPES.DEFAULT_TERMS_OF_PAYMENT,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          id: 2,
          terms_type: TERMS_AND_CONDITIONS_TYPES.TERMS_OF_PAYMENT,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ]);
    }
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, {
      id: [1, 2],
    });
  },
};
