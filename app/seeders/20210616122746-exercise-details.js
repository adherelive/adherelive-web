"use strict";

import { USER_CATEGORY } from "../../constant";
import { TABLE_NAME } from "../models/exerciseDetails";

const exercises = [
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
];

module.exports = {
  up: async (queryInterface) => {
    // Optional: Check if exercise IDs exist before seeding
    const existingExercises = await queryInterface.sequelize.query(
      `SELECT id FROM exercises WHERE id IN (1, 2, 3, 4, 5)`,
      { type: queryInterface.sequelize.QueryTypes.SELECT }
    );

    const existingIds = existingExercises.map((exercise) => exercise.id);

    // Filter out entries with non-existent exercise IDs
    const validExercises = exercises.filter((exercise) =>
      existingIds.includes(exercise.exercise_id)
    );

    if (validExercises.length > 0) {
      return queryInterface.bulkInsert(TABLE_NAME, validExercises);
    } else {
      console.warn("No valid exercises found to seed.");
      return Promise.resolve(); // No insertion needed
    }
  },

  down: async (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
