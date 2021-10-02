'use strict';

import {TABLE_NAME} from "../app/models/symptoms";
import {TABLE_NAME as patientTableName} from "../app/models/patients";
import {TABLE_NAME as carePlanTableName} from "../app/models/carePlan";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            patient_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: patientTableName,
                    },
                    key: 'id'
                }
            },
            care_plan_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: carePlanTableName,
                    },
                    key: 'id'
                }
            },
            config: {
                type: Sequelize.JSON
            },
            text: {
                type: Sequelize.STRING(1000)
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
