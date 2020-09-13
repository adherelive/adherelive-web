"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const TreatmentCondition = database.define(
    DB_TABLES.TREATMENT_CONDITION_MAPPING,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        condition_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.CONDITIONS,
                },
                key: 'id'
            }
        },
        treatment_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.TREATMENTS,
                },
                key: 'id'
            }
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

export default TreatmentCondition;
