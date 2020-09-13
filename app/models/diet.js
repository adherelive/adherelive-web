"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import Actions from "./actions";

const Diet = database.define(
    DB_TABLES.EXERCISE,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        action_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.ACTIONS,
                },
                key: 'id'
            }
        },
        type: {
            type: Sequelize.STRING,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        condition: {
            type: Sequelize.STRING,
            allowNull: false
        },
        default_frequency: {
            type: Sequelize.STRING,
            allowNull: false
        },
        restriction_age: {
            type: Sequelize.STRING,
            allowNull: false
        },
        content_reference: {
            type: Sequelize.STRING,
            allowNull: false
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    action_id: this.action_id,
                    type: this.type,
                    description: this.description,
                    condition: this.condition,
                    default_frequency: this.default_frequency,
                    restriction_age: this.restriction_age,
                    content_reference: this.content_reference,
                };
            }
        }
    }
);

Diet.belongsTo(Actions, {
    foreignKey: "action_id",
    targetKey: "id"
});

export default Diet;
