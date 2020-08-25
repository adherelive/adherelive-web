"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const UserDevices = database.define(
    DB_TABLES.USER_DEVICES,
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
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
        platform: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        one_signal_user_id: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        push_token: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default UserDevices;
