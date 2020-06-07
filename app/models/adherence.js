"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import ActionDetails from "./actionDetails";

const Adherence = database.define(
    DB_TABLES.ADHERENCE,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        action_details_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.ACTION_DETAILS,
                },
                key: 'id'
            }
        },
        adherence: {
            type: Sequelize.STRING(1)
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    name: this.name,
                };
            }
        }
    }
);

Adherence.belongsTo(ActionDetails, {
    foreignKey: "action_details_id",
    targetKey: "id"
});

export default Adherence;
