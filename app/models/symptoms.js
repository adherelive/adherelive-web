"use strict";
import {DataTypes} from "sequelize";
import {PATIENTS} from "./patients";
import {CARE_PLANS} from "./carePlan";

export const SYMPTOMS = "symptoms";

export const db = (database) => {
    database.define(
        SYMPTOMS,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
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
            care_plan_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: CARE_PLANS,
                    },
                    key: 'id'
                }
            },
            config: {
                type: DataTypes.JSON
            },
            text: {
                type: DataTypes.STRING(1000)
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};


export const associate = (database) => {
    const {symptoms, patients, care_plans} = database.models || {};

    // associations here (if any) ...
    symptoms.hasOne(patients, {
        foreignKey: "id",
        sourceKey: "patient_id"
    });

    symptoms.hasOne(care_plans, {
        foreignKey: "id",
        sourceKey: "care_plan_id"
    });
};
