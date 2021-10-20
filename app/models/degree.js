"use strict";
import {DataTypes} from "sequelize";

export const TABLE_NAME = "degrees";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            user_created: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue:null
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...
};