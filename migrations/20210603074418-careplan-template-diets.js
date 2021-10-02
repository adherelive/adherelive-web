'use strict';

import {TABLE_NAME} from "../app/models/templateDiets";
import {TABLE_NAME as carePlanTemplateTableName} from "../app/models/careplanTemplate";

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable(TABLE_NAME, {
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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_calories: {
                type: DataTypes.FLOAT(11, 2),
            },
            duration: {
                type: DataTypes.INTEGER
            },
            details: {
                type: DataTypes.JSON,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            deleted_at: {
                allowNull: true,
                type: DataTypes.DATE
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable(TABLE_NAME);
    }
};
