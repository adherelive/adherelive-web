"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const OtpVerifications = database.define(
    DB_TABLES.OTP_VERIFICATIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.USERS,
                },
                key: 'id'
            }
        },
        otp: {
            type: Sequelize.STRING(4),
            allowNull: false,
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default OtpVerifications;
