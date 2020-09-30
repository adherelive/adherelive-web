"use strict";
import {DataTypes} from "sequelize";
import {ACTIONS} from "./actions";

export const EXERCISES = "exercises";

export const db = (database) => {
    database.define(
        EXERCISES,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            action_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: ACTIONS,
                    },
                    key: 'id'
                }
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            description: {
                type: DataTypes.STRING(1000),
                allowNull: false
            },
            condition: {
                type: DataTypes.STRING,
                allowNull: false
            },
            default_frequency: {
                type: DataTypes.STRING,
                allowNull: false
            },
            restriction_age: {
                type: DataTypes.STRING,
                allowNull: false
            },
            content_reference: {
                type: DataTypes.STRING,
                allowNull: false
            },
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        action_id: this.action_id,
                        type: this.type,
                        description: this.description,
                        condition: this.condition,
                        default_frequency: this.default_frequency,
                        restriction_age: this.restriction_age,
                        content_reference: this.content_reference,
                    };
                }
            }
        }
    );
};

export const associate = (database) => {
    const {exercises, actions} = database.models || {};

    // associations here (if any) ...
    exercises.belongsTo(actions, {
        foreignKey: "action_id",
        targetKey: "id"
    });
};
