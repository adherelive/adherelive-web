"use strict";
import moment from "moment";
import { TABLE_NAME } from "../models/templateWorkouts";

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        care_plan_template_id: 1,
        name: "Test Workout",
        duration: 7,
        total_calories: 1000,
        time: moment()
          .seconds(0)
          .toDate(),
        details: JSON.stringify({
          not_to_do: "",
          repeat_days: ["Sun", "Mon"],
          workout_exercise_groups: [
            {
              notes: "",
              sets: 1,
              exercise_detail_id: 1
            },
            {
              notes: "",
              sets: 2,
              exercise_detail_id: 2
            }
          ]
        }),
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  down: queryInterface => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
