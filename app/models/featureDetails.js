"use strict";
import {DataTypes} from "sequelize";
import {FEATURE_TYPE} from "../../constant";

export const TABLE_NAME = "feature_details";

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
            feature_type: {
                type: DataTypes.ENUM,
                values: [...Object.values(FEATURE_TYPE)]
            },
            details: {
                type: DataTypes.JSON,
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