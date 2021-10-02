"use strict";

import {TABLE_NAME} from "../app/models/workoutTemplateExerciseMapping";
import {TABLE_NAME as workoutTemplateTableName} from "../app/models/workoutTemplate";
import {TABLE_NAME as exerciseDetailTableName} from "../app/models/exerciseDetails";

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
            },
            workout_template_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: workoutTemplateTableName,
                    },
                    key: "id",
                },
            },
            exercise_detail_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: exerciseDetailTableName,
                    },
                    key: "id",
                },
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
    },
};
