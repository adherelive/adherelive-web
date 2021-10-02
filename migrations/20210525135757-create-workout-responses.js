'use strict';

import {TABLE_NAME} from "../app/models/workoutResponses";
import {TABLE_NAME as workoutTableName} from "../app/models/workout";
import {TABLE_NAME as exerciseGroupTableName} from "../app/models/exerciseGroup";
import {TABLE_NAME as repetitionTableName} from "../app/models/exerciseRepetition";
import {TABLE_NAME as scheduleEventsTable} from "../app/models/scheduleEvents";

import {WORKOUT_RESPONSE_STATUS} from "../constant";


module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            workout_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: workoutTableName,
                    },
                    key: "id",
                },
            },
            exercise_group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: exerciseGroupTableName,
                    },
                    key: "id",
                },
            },
            schedule_event_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: scheduleEventsTable,
                    },
                    key: "id",
                },
            },
            repetition_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: repetitionTableName,
                    },
                    key: "id",
                },
            },
            repetition_value: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            sets: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            status: {
                type: DataTypes.ENUM,
                allowNull: false,
                values: [
                    WORKOUT_RESPONSE_STATUS.DONE,
                    WORKOUT_RESPONSE_STATUS.EXPIRED,
                    WORKOUT_RESPONSE_STATUS.PARTIALLY_DONE,
                    WORKOUT_RESPONSE_STATUS.SKIPPED
                ]
            },
            other_details: {
                type: DataTypes.JSON
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

    down: (queryInterface) => {
        return queryInterface.dropTable(TABLE_NAME);
    }
};
