"use strict";
import {DataTypes} from "sequelize";

export const DEGREES = "degrees";

export const db = (database) => {
    database.define(
        DEGREES,
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