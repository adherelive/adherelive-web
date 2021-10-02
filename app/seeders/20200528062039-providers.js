"use strict";

import {TABLE_NAME} from "../models/providers";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.bulkInsert(TABLE_NAME, [
            {
                name: "Test Provider",
                user_id: "5",
                created_at: new Date(),
                updated_at: new Date()
            }
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
