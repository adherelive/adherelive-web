'use strict';

import {TABLE_NAME} from "../app/models/providers";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.addColumn(TABLE_NAME, "details", {
                type: Sequelize.JSON
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.removeColumn(TABLE_NAME, "details")
        ]);
    }
};
