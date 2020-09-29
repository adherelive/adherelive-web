"use strict";
import {DataTypes} from "sequelize";
import {MEDICINES} from './medicines'; // todo :: doesn't makes sense here
import {CARE_PLAN_TEMPLATES} from "./careplanTemplate";

export const TEMPLATE_MEDICATIONS = "template_medications";

export const db = (database) => {
    database.define(
        TEMPLATE_MEDICATIONS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            care_plan_template_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: CARE_PLAN_TEMPLATES,
                    },
                    key: 'id'
                }
            },
            medicine_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: MEDICINES,
                    },
                    key: 'id'
                }
            },
            schedule_data: {
                type: DataTypes.JSON,
                allowNull: true
            },
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        care_plan_template_id: this.care_plan_template_id,
                        medicine_id: this.medicine_id,
                        schedule_data: this.schedule_data,
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
    const {template_medications, medicines} = database.models || {};

    // associations here (if any) ...
    template_medications.hasOne(medicines, {
        foreignKey: "id",
        sourceKey: "medicine_id"
    });
};