"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import {ACTION_TYPE, DB_TABLES} from "../../constant";
import CarePlan from "./carePlan";

const Actions = database.define(
    DB_TABLES.ACTIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        care_plan_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.CARE_PLANS,
                },
                key: 'id'
            }
        },
        type: {
            type: Sequelize.ENUM,
            values: [ACTION_TYPE.MEDICATION, ACTION_TYPE.EXERCISE, ACTION_TYPE.DIET],
            allowNull: false
        },
        frequency_per_day: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        reference_link: {
            type: Sequelize.STRING(1000),
        },
        start_date: {
            type: Sequelize.DATE,
        },
        end_date: {
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
                    care_plan_id:this.care_plan_id,
                    type:this.type,
                    frequency_per_day:this.frequency_per_day,
                    reference_link:this.reference_link,
                    start_date:this.start_date,
                    end_date:this.end_date
                };
            }
        }
    }
);

Actions.belongsTo(CarePlan, {
    foreignKey:"care_plan_id",
    targetKey:"id"
});

export default Actions;
