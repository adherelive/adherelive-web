"use strict";
import {DataTypes} from "sequelize";
import {USERS} from "./users";

export const OTP_VERIFICATIONS = "otp_verifications";

export const db = (database) => {
    database.define(
        OTP_VERIFICATIONS,
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
                        tableName: USERS,
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
