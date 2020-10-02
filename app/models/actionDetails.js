"use strict";
import {DataTypes} from "sequelize";
import {ACTIONS} from "./actions";

export const ACTION_DETAILS = "action_details";

export const db =  (database) => {
    database.define(
        ACTION_DETAILS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            action_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: ACTIONS,
                    },
                    key: 'id'
                }
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false
            },
            dosage: {
                type: DataTypes.STRING,
                allowNull: true
            },
            time: {
                type: DataTypes.DATE,
                allowNull: false
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
}

export const associate = (database) => {
    const {action_details, actions} = database.models || {};

    // action_details.belongsTo(actions, {
    //     foreignKey: "action_id",
    //     targetKey: "id"
    // });
};
