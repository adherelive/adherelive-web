"use strict";
import {TABLE_NAME} from "../app/models/exerciseDetails";
import {USER_CATEGORY} from "../constant";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "creator_type", {
                type: Sequelize.ENUM,
                values: [
                    USER_CATEGORY.DOCTOR,
                    USER_CATEGORY.PROVIDER,
                    USER_CATEGORY.ADMIN,
                    USER_CATEGORY.HSP
                ],
                defaultValue: USER_CATEGORY.ADMIN,

            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "creator_type"),

        ]);
    }
};
