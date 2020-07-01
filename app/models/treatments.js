"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";
import CarePlanTemplate from "./careplanTemplate";

const Treatment = database.define(
    DB_TABLES.TREATMENTS,
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

// Treatment.belongsTo(CarePlanTemplate, {
//     as: 'care_plan_templates',
//     foreignKey: 'id',
//     targetKey: 'treatment_id'
// });

export default Treatment;
