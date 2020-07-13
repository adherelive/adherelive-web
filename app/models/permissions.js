"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const Permissions = database.define(
    DB_TABLES.PERMISSIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING(100),
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default Permissions;
