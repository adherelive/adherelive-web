"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import ActionDetails from "./actionDetails";

const EmailLoggers = database.define(
    DB_TABLES.EMAIL_LOGGER,
    {
        id: {
            type: Sequelize.BIGINT,
            primaryKey: true,
            autoIncrement: true,
            unsigned: true
          },
          data: {
            type: "json",
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
                    data: this.data
                    
                };
            }
        }
    }
);



export default EmailLoggers;
