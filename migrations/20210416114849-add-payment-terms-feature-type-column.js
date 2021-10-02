"use strict";
import {TABLE_NAME} from "../app/models/featureDetails";
import {FEATURE_TYPE} from "../constant";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "feature_type", {
                type: Sequelize.ENUM,
                values: [...Object.values(FEATURE_TYPE)],
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "feature_type")
        ]);
    }
};
