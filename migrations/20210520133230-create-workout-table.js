'use strict';

import {TABLE_NAME} from "../app/models/workout";
import {TABLE_NAME as carePlanTableName} from "../app/models/carePlan";


module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            care_plan_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: carePlanTableName,
                    },
                    key: "id",
                },
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            total_calories: {
                type: DataTypes.FLOAT(11, 2),
            },
            start_date: {
                type: DataTypes.DATE,
            },
            end_date: {
                type: DataTypes.DATE,
            },
            details: {
                type: DataTypes.JSON,
            },
            time: {
                type: DataTypes.DATE,
                allowNull: false,
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            deleted_at: {
                type: DataTypes.DATE,
            },
        });
    },

    down: (queryInterface, DataTypes) => {
        return queryInterface.dropTable(TABLE_NAME);
    }
};
