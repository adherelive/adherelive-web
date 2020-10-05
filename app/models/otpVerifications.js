"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as userTableName} from "./users";

export const TABLE_NAME = "otp_verifications";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: userTableName,
                    },
                    key: 'id'
                }
            },
            otp: {
                type: DataTypes.STRING(4),
                allowNull: false,
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...
};
