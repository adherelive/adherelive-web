"use strict";

import {TABLE_NAME} from "../models/templateMedications";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(TABLE_NAME, [
            {
                care_plan_template_id: 1,
                medicine_id: 1,
                schedule_data: JSON.stringify({
                    unit: "mg",
                    repeat: "weekly",
                    quantity: 1,
                    strength: 2,
                    medicine_id: "1",
                    repeat_days: ["Mon", "Fri"],
                    when_to_take: ["6"],
                    repeat_interval: 0,
                    medication_stage: "",
                    duration: 5,
                    description: "Don't eat for 30 minutes after taking this medication",
                    medicine_type: "2"
                }),
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                care_plan_template_id: 1,
                medicine_id: 2,
                schedule_data: JSON.stringify({
                    unit: "ml",
                    repeat: "weekly",
                    quantity: 1,
                    strength: 5,
                    medicine_id: "3",
                    repeat_days: ["Sun", "Thu", "Tue"],
                    when_to_take: ["4"],
                    repeat_interval: 0,
                    medication_stage: "",
                    duration: 6,
                    description: "Take after eating",
                    medicine_type: "2"
                }),
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
