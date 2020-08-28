"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

import Users from "./users";
import UserCategoryPermissions from "./userCategoryPermissions";

const Permissions = database.define(
    DB_TABLES.PERMISSIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.STRING(100),
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

// Permissions.belongsToMany(Users, {
//     through: DB_TABLES.USER_CATEGORY_PERMISSIONS,
//     targetKey:"category"
// });

export default Permissions;
