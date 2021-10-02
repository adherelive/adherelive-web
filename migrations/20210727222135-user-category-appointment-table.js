"use strict";
import {TABLE_NAME} from "../app/models/appointments";
import {USER_CATEGORY} from "../constant";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "participant_one_type", {
                type: Sequelize.ENUM,
                values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.HSP]
            }),
            queryInterface.changeColumn(TABLE_NAME, "participant_two_type", {
                type: Sequelize.ENUM,
                values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.HSP]
            }),
            queryInterface.changeColumn(TABLE_NAME, "organizer_type", {
                type: Sequelize.ENUM,
                values: [
                    USER_CATEGORY.DOCTOR,
                    USER_CATEGORY.PATIENT,
                    USER_CATEGORY.CARE_TAKER,
                    USER_CATEGORY.HSP
                ]
            })
        ]);
    },

    down: (queryInterface, Sequelize) => {
        return Promise.all([
            queryInterface.changeColumn(TABLE_NAME, "participant_one_type"),
            queryInterface.changeColumn(TABLE_NAME, "participant_two_type"),
            queryInterface.changeColumn(TABLE_NAME, "organizer_type"),

        ]);
    }
};
