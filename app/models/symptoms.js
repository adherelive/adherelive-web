"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const Symptoms = database.define(
    DB_TABLES.SYMPTOMS,
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        patient_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.PATIENTS,
                },
                key: 'id'
            }
        },
        care_plan_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
                model: {
                    tableName: DB_TABLES.CARE_PLANS,
                },
                key: 'id'
            }
        },
        config: {
            type: Sequelize.JSON
        },
        text: {
            type: Sequelize.STRING(1000)
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default Symptoms;
