"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const CarePlanTemplate = database.define(
    DB_TABLES.CARE_PLAN_TEMPLATE,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        severity: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          condition: {
            type: Sequelize.STRING,
            allowNull: false,
          },
        details: {
            type: Sequelize.JSON,
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    type: this.type,
                    severity: this.severity,
                    condition: this.condition,
                    details: this.details
                };
            }
        }
    }
);

export default CarePlanTemplate;
