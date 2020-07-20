"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const UserPreferences = database.define(
    DB_TABLES.USER_PREFERENCES,
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
        details: {
            type: Sequelize.JSON,
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default UserPreferences;
