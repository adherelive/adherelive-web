"use strict";

import { TABLE_NAME } from "../models/templateDiets";

module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        care_plan_template_id: 1,
        name: "Test Diet",
        duration: 7,
        total_calories: 1000,
        details: JSON.stringify({
          not_to_do: "",
          repeat_days: ["Sun", "Mon"],
          diet_food_groups: {
            "1": [
              { notes: "", serving: 1, portion_id: 1, food_item_detail_id: 2 }
            ],
            "2": [
              { notes: "", serving: 2, portion_id: 1, food_item_detail_id: 4 }
            ]
          }
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
