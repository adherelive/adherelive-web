import {DataTypes} from "sequelize";
import {VITAL_TEMPLATES} from "./vitalTemplates";
import {CARE_PLANS} from "./carePlan";

export const VITALS = "vitals";

export const db = (database) => {
    database.define(
        VITALS,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            vital_template_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: VITAL_TEMPLATES,
                    },
                    key: 'id'
                }
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
            details: {
                type: DataTypes.JSON
            },
            description: {
                type: DataTypes.STRING(1000),
            },
            start_date: {
                type: DataTypes.DATE
            },
            end_date: {
                type: DataTypes.DATE
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};


export const associate = (database) => {
    const {vitals, vital_templates, care_plans} = database.models || {};

    // associations here (if any) ...
    vitals.hasOne(vital_templates, {
        foreignKey: "id",
        sourceKey: "vital_template_id"
    });

    vitals.hasOne(care_plans, {
        foreignKey: "id",
        sourceKey: "care_plan_id"
    });
};