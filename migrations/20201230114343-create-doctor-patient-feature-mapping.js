"use strict";

import {TABLE_NAME} from "../app/models/doctorPatientFeatureMapping";

import {TABLE_NAME as doctorTableName} from "../app/models/doctors";
import {TABLE_NAME as patientTableName} from "../app/models/patients";
import {TABLE_NAME as featureTableName} from "../app/models/features";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            doctor_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: doctorTableName
                    },
                    key: "id"
                }
            },
            patient_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: patientTableName
                    },
                    key: "id"
                }
            },
            feature_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: featureTableName
                    },
                    key: "id"
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
