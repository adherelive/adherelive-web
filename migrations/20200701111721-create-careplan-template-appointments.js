"use strict";

import {DB_TABLES} from "../constant";
import {TABLE_NAME} from "../app/models/templateAppointments";
import {TABLE_NAME as carePlanTemplateTableName} from "../app/models/careplanTemplate";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            care_plan_template_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: carePlanTemplateTableName
                    },
                    key: "id"
                }
            },
            reason: {
                type: Sequelize.STRING,
                allowNull: false
            },
            time_gap: {
                type: Sequelize.STRING,
                allowNull: false
            },
            details: {
                type: Sequelize.JSON,
                allowNull: true
            },
            provider_id: {
                type: Sequelize.INTEGER,
                allowNull: true
            },
            provider_name: {
                type: Sequelize.STRING(100),
                allowNull: true
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
