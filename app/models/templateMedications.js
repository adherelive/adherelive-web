"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as medicineTableName} from './medicines'; // todo :: doesn't makes sense here
import {TABLE_NAME as carePlanTemplateTableName} from "./careplanTemplate";

export const TABLE_NAME = "template_medications";

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
                        tableName: carePlanTemplateTableName,
                    },
                    key: 'id'
                }
            },
            medicine_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: medicineTableName,
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
    // associations here (if any) ...
    database.models[TABLE_NAME].hasOne(database.models[medicineTableName], {
        foreignKey: "id",
        sourceKey: "medicine_id"
    });
};