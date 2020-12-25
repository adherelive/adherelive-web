"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as carePlanTemplateTableName} from "./careplanTemplate";
import {TABLE_NAME as providerTableName} from "./providers";


export const TABLE_NAME = "template_appointments";

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
            care_plan_template_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: carePlanTemplateTableName
                    },
                    key: "id"
                }
            },
            reason: {
                type: DataTypes.STRING,
                allowNull: false
            },
            time_gap: {
                type: DataTypes.STRING,
                allowNull: false
            },
            details: {
                type: DataTypes.JSON,
                allowNull: true
            },
            provider_id: {
                type: DataTypes.INTEGER,
                references: {
                    model: {
                        tableName: providerTableName
                    },
                    key: "id"
                },
                allowNull: true
            },
            provider_name: {
                type: DataTypes.STRING(100),
                allowNull: true
            }
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        care_plan_template_id: this.care_plan_template_id,
                        time_gap: this.time_gap,
                        details: this.details
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
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...
    // TemplateAppointment.belongsTo(CarePlanTemplate, {
    //   foreignKey: "care_plan_template_id",
    //   targetKey: "id"
    // });
};