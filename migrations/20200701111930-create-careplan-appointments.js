'use strict';

import {TABLE_NAME} from "../app/models/carePlanAppointments";
import {TABLE_NAME as carePlanTableName} from "../app/models/carePlan";
import {TABLE_NAME as appointmentTableName} from "../app/models/appointments";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            care_plan_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: carePlanTableName,
                    },
                    key: 'id'
                }
            },
            appointment_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: appointmentTableName,
                    },
                    key: 'id'
                }
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
        return queryInterface.dropTable(TABLE_NAME);
    }
};
