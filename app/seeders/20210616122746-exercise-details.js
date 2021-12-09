"use strict";

import { USER_CATEGORY } from "../../constant";
import { TABLE_NAME } from "../models/exerciseDetails";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        exercise_id: 1,
        repetition_id: 6,
        repetition_value: 1,
        calorific_value: 100,
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        exercise_id: 2,
        repetition_id: 6,
        repetition_value: 1,
        calorific_value: 100,
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        exercise_id: 3,
        repetition_id: 6,
        repetition_value: 1,
        calorific_value: 100,
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        exercise_id: 4,
        repetition_id: 5,
        repetition_value: 1,
        calorific_value: 100,
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        exercise_id: 5,
        repetition_id: 5,
        repetition_value: 1,
        calorific_value: 100,
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
