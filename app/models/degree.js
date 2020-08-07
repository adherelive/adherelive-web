"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const Degree = database.define(
    DB_TABLES.DEGREE,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default Degree;
