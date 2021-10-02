"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as carePlanTableName} from "./carePlan";
import {TABLE_NAME as appointmentTableName} from "./appointments";

export const TABLE_NAME = "care_plan_appointments";

export const db = (database) => {
    database.define(
        TABLE_NAME,
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
                        tableName: carePlanTableName,
                    },
                    key: 'id'
                }
            },
            appointment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: appointmentTableName,
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
                        appointment_id: this.appointment_id
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
    // associations here (if any) ...
    database.models[TABLE_NAME].hasOne(database.models[appointmentTableName], {
        foreignKey: "id",
        targetKey: "appointment_id"
    });
};
