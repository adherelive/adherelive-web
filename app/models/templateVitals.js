"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as carePlanTemplateTableName} from "./careplanTemplate";
import {TABLE_NAME as vitalTemplatesTableName} from "./vitalTemplates";

export const TABLE_NAME = "template_vitals";

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
            vital_template_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: vitalTemplatesTableName,
                    },
                    key: 'id'
                }
            },
            details: {
                type: DataTypes.JSON,
                allowNull: true
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = database => {
    // const {TABLE_NAME} = database.models || {};
    // associations here (if any) ...
    database.models[TABLE_NAME].hasOne(database.models[vitalTemplatesTableName], {
        foreignKey: "id",
        sourceKey: "vital_template_id"
    });
};
