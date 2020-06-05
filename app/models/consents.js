"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const Consents = database.define(
    DB_TABLES.CONSENTS,
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        details: {
            type: Sequelize.JSON,
        },
        activated_on: {
            type: Sequelize.DATE,
        },
        expired_on: {
            type: Sequelize.DATE,
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    type:this.type,
                    details: this.details,
                    activated_on: this.activated_on,
                    expired_on: this.expired_on
                };
            }
        }
    }
);

export default Consents;
