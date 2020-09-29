"use strict";
import {DataTypes} from "sequelize";
import {CARE_PLANS} from "./carePlan";
import {MEDICATIONS} from "./medicationReminders";

export const CARE_PLAN_MEDICATIONS = "care_plan_medications";

export const db = (database) => {
    database.define(
        CARE_PLAN_MEDICATIONS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            care_plan_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: CARE_PLANS,
                    },
                    key: 'id'
                }
            },
            medication_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: MEDICATIONS,
                    },
                    key: 'id'
                }
            },
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        care_plan_id: this.care_plan_id,
                        medication_id: this.medication_id,
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
    const {care_plan_medications, medications} = database.models || {};

    // associations here (if any) ...
    care_plan_medications.hasOne(medications, {
        foreignKey: "id",
        targetKey: "medication_id"
    });
};
