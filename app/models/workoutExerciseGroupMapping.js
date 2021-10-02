"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as exerciseGroupTableName} from "./exerciseGroup";
import {TABLE_NAME as workoutTableName} from "./workout";

export const TABLE_NAME = "workout_exercise_group_mappings";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
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
            // time: {
            //   type: DataTypes.DATE,
            //   allowNull: false,
            // },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
};
