'use strict';

import {DB_TABLES} from "../constant";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(DB_TABLES.PATIENT_CARE_TAKERS, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            patient_id: {
                type: Sequelize.INTEGER
            },
            care_taker_id: {
                type: Sequelize.INTEGER
            },
            consent_id: {
                type: Sequelize.INTEGER
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(DB_TABLES.PATIENT_CARE_TAKERS);
    }
};
