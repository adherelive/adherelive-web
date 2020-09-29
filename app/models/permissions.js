"use strict";
import {DataTypes} from "sequelize";
import {USER_CATEGORY_PERMISSIONS} from "./userCategoryPermissions";

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
    const {permissions, users} = database.models || {};

    // associations here (if any) ...
    permissions.belongsToMany(users, {
        through: USER_CATEGORY_PERMISSIONS,
        foreignKey:"category"
    });
};