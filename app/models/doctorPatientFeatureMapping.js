"use strict";

import {DataTypes} from "sequelize";
import {TABLE_NAME as doctorTableName} from "./doctors";
import {TABLE_NAME as patientTableName} from "./patients";
import {TABLE_NAME as featureTableName} from "./features";

export const TABLE_NAME = "doctor_patient_feature_mappings";

export const db = database => {
    database.define(
        TABLE_NAME,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            doctor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: doctorTableName
                    },
                    key: "id"
                }
            },
            patient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: patientTableName
                    },
                    key: "id"
                }
            },
            feature_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: featureTableName
                    },
                    key: "id"
                }
            }
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        name: this.name,
                        details: this.details
                    };
                }
            }
        }
    );
};

export const associate = database => {
    const {doctor_patient_feature_mappings, features, doctors, patients} =
    database.models || {};

    // associations here (if any) ...
    doctor_patient_feature_mappings.belongsTo(features, {
        foreignKey: "feature_id",
        targetKey: "id"
    });

    doctor_patient_feature_mappings.belongsTo(doctors, {
        foreignKey: "doctor_id",
        targetKey: "id"
    });

    doctor_patient_feature_mappings.belongsTo(patients, {
        foreignKey: "patient_id",
        targetKey: "id"
    });
};
