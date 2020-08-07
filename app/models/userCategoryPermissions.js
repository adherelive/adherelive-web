"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY} from "../../constant";
import Users from "./users";

const UserCategoryPermissions = database.define(
    DB_TABLES.USER_CATEGORY_PERMISSIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        category: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.PATIENT, USER_CATEGORY.DOCTOR, USER_CATEGORY.ADMIN, USER_CATEGORY.CARE_TAKER, USER_CATEGORY.PROVIDER],
        },
        permission_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.PERMISSIONS,
                },
                key: 'id'
            }
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

UserCategoryPermissions.hasOne(Users, {
    foreignKey: "id",
    targetKey: "user_id"
});

export default UserCategoryPermissions;
