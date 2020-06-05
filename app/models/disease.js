"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";

const Disease = database.define(
    DB_TABLES.DISEASE,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        description: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    description: this.description,
                };
            }
        }
    }
);

export default Disease;
