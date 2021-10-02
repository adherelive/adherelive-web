'use strict';

import {TABLE_NAME} from "../models/treatmentConditionMapping";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(TABLE_NAME, [
            {
                condition_id: "1",
                treatment_id: "1",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "1",
                treatment_id: "2",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "1",
                treatment_id: "3",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "2",
                treatment_id: "1",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "2",
                treatment_id: "4",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "3",
                treatment_id: "1",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "3",
                treatment_id: "2",
                created_at: new Date(),
                updated_at: new Date()
            },
            // {
            //   condition_id: "3",
            //   treatment_id: "5",
            //   created_at: new Date(),
            //   updated_at: new Date()
            // },
            {
                condition_id: "4",
                treatment_id: "1",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "4",
                treatment_id: "2",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "5",
                treatment_id: "1",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "5",
                treatment_id: "2",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "6",
                treatment_id: "1",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "6",
                treatment_id: "2",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "1",
                treatment_id: "5",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                condition_id: "1",
                treatment_id: "6",
                created_at: new Date(),
                updated_at: new Date()
            },
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
