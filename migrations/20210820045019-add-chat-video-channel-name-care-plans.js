'use strict';

import {TABLE_NAME} from "../app/models/carePlan";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(TABLE_NAME, "channel_id", {
                type: Sequelize.STRING,

            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn(TABLE_NAME, "channel_id")
        ]);
    }
};
