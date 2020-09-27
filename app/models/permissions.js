"use strict";
import {DataTypes} from "sequelize";

export const PERMISSIONS = "permissions";

export const db = (database) => {
    database.define(
        PERMISSIONS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            type: {
                type: DataTypes.STRING(100),
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {<TABLE_NAME>} = database.models || {};

    // associations here (if any) ...
    // Permissions.belongsToMany(Users, {
    //     through: DB_TABLES.USER_CATEGORY_PERMISSIONS,
    //     targetKey:"category"
    // });
};