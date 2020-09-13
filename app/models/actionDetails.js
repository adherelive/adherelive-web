"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";

const ActionDetails = database.define(
    DB_TABLES.ACTION_DETAILS,
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
        dosage: {
            type: Sequelize.STRING,
            allowNull: false
        },
        time: {
            type: Sequelize.DATE,
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
                    dosage: this.dosage,
                    time: this.time,
                };
            }
        }
    }
);

// ActionDetails.belongsTo(Actions, {
//     foreignKey: "action_id",
//     targetKey: "id"
// });

export default ActionDetails;
