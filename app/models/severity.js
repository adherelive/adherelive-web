"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const Severity = database.define(
    DB_TABLES.SEVERITY,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
    },
    {
        underscored: true,
        paranoid: true,
        freezeTableName: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    name:this.name,
                };
            }
        }
    }
);

export default Severity;
