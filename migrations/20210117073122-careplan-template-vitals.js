'use strict';

import {DataTypes} from "sequelize";

import {TABLE_NAME} from "../app/models/templateVitals";
import {TABLE_NAME as carePlanTemplateTableName} from "../app/models/careplanTemplate";
import {TABLE_NAME as vitalTemplatesTableName} from "../app/models/vitalTemplates";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            care_plan_template_id: {
                type: Sequelize.INTEGER,
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
                type: Sequelize.JSON,
                allowNull: true
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(TABLE_NAME);
    }
};
