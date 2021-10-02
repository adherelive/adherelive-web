'use strict';

import {TABLE_NAME} from "../models/exerciseRepetition";

module.exports = {
    up: (queryInterface) => {
        return queryInterface.bulkInsert(TABLE_NAME, [
            {
                type: "steps",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                type: "laps",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                type: "seconds",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                type: "minutes",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                type: "hours",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                type: "repetitions",
                created_at: new Date(),
                updated_at: new Date()
            },
        ]);
    },

    down: (queryInterface) => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
