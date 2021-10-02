"use strict";

import {TABLE_NAME} from "../models/features";

module.exports = {
    up: queryInterface => {
        return queryInterface.bulkInsert(TABLE_NAME, [
            {
                name: "Chat",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Video Call",
                created_at: new Date(),
                updated_at: new Date()
            },
            {
                name: "Audio Call",
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: queryInterface => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
