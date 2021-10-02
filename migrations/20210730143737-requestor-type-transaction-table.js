"use strict";
import {TABLE_NAME} from "../app/models/transactions";
import {USER_CATEGORY_ARRAY} from "../app/models/users";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "requestor_type", {
                type: Sequelize.ENUM,
                values: USER_CATEGORY_ARRAY
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "requestor_type"),

        ]);
    }
};
