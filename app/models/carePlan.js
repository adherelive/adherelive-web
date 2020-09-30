"use strict";
import {DataTypes} from "sequelize";
import {DOCTORS} from "./doctors";
import {PATIENTS} from "./patients";
import {CARE_PLAN_TEMPLATE} from "./careplanTemplate";

export const CARE_PLANS = "care_plans";

export const db = (database) => {
    database.define(
        CARE_PLANS,
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
                        tableName: DOCTORS,
                    },
                    key: 'id'
                }
            },
            patient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: PATIENTS,
                    },
                    key: 'id'
                }
            },
            care_plan_template_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: CARE_PLAN_TEMPLATE,
                    },
                    key: 'id'
                }
            },
            details: {
                type: DataTypes.JSON,
            },
            activated_on: {
                type: DataTypes.DATE,
            },
            renew_on: {
                type: DataTypes.DATE,
            },
            expired_on: {
                type: DataTypes.DATE,
                allowNull: false
            },
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        // name: this.name,
                        // condition_id: this.condition_id,
                        // consent_id: this.consent_id,
                        doctor_id: this.doctor_id,
                        patient_id: this.patient_id,
                        details: this.details,
                        activated_on: this.activated_on,
                        renew_on: this.renew_on,
                        expired_on: this.expired_on
                    };
                },
                getId() {
                    return this.id;
                }
            }
        }
    );
};

export const associate = (database) => {
    const {care_plans, patients, doctors, care_plan_appointments, care_plan_medications} = database.models || {};

    // associations here (if any) ...
    care_plans.hasOne(patients, {
        foreignKey: "id",
        sourceKey: "patient_id"
    });

    care_plans.hasOne(doctors, {
        foreignKey: "id",
        sourceKey: "doctor_id"
    });

    care_plans.hasMany(care_plan_appointments, {
        foreignKey:"care_plan_id",
        sourceKey:"id"
    });

    care_plans.hasMany(care_plan_medications, {
        foreignKey:"care_plan_id",
        sourceKey:"id"
    });
};

// CarePlan.hasOne(Conditions, {
//     foreignKey: "condition_id",
//     targetKey: "id"
// });

// CarePlan.hasOne(Consents, {
//     foreignKey: "consent_id",
//     targetKey: "id"
// });

//
// CarePlan.hasMany(Symptoms, {
//     foreignKey:"cae_plan_id",
//     sourceKey:"id"
// });