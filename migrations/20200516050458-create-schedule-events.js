'use strict';

import {DB_TABLES, EVENT_STATUS, EVENT_TYPE} from "../constant";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(DB_TABLES.SCHEDULE_EVENTS, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            event_type: {
                type: Sequelize.ENUM,
                values: [EVENT_TYPE.APPOINTMENT, EVENT_TYPE.REMINDER, EVENT_TYPE.MEDICATION_REMINDER]
            },
            event_id: {
                type: Sequelize.INTEGER,
            },
            participant_one: {
                type: Sequelize.INTEGER,
            },
            participant_two: {
                type: Sequelize.INTEGER,
            },
            details: {
                type: Sequelize.JSON,
            },
            status: {
                type: Sequelize.ENUM,
                values: [
                    EVENT_STATUS.SCHEDULED,
                    EVENT_STATUS.PENDING,
                    EVENT_STATUS.COMPLETED,
                    EVENT_STATUS.EXPIRED,
                    EVENT_STATUS.CANCELLED
                ]
            },
            date: {
                type: Sequelize.DATEONLY,
            },
            start_time: {
                type: Sequelize.DATE,
            },
            end_time: {
                type: Sequelize.DATE,
            },
            created_at: {
                type: Sequelize.DATE,
            },
            updated_at: {
                type: Sequelize.DATE,
            },
            deleted_at: {
                type: Sequelize.DATE,
                allowNull: true,
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(DB_TABLES.SCHEDULE_EVENTS);
    }
};
