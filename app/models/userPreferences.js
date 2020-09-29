"use strict";
import {DataTypes} from "sequelize";
import {USERS} from "./users";

export const USER_PREFERENCES = "user_preferences";

export const db = (database) => {
    database.define(
        USER_PREFERENCES,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: USERS,
                    },
                    key: 'id'
                }
            },
            details: {
                type: DataTypes.JSON,
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {upload_documents} = database.models || {};

    // associations here (if any) ...
};