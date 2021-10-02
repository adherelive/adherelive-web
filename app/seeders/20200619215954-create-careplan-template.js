'use strict';

import {TABLE_NAME} from "../models/careplanTemplate";

module.exports = {
    up: (queryInterface, Sequelize) => {

        return queryInterface.bulkInsert(TABLE_NAME, [
            {
                name: 'Sample Care Plan',
                treatment_id: '1',
                severity_id: '1',
                condition_id: '1',
                created_at: new Date(),
                updated_at: new Date(),
            },
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.bulkDelete(TABLE_NAME, null, {});
    }
};
