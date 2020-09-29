"use strict";
import {DataTypes} from "sequelize";
import {PERMISSIONS} from "./permissions";
import {USER_CATEGORY} from "../../constant";

export const USER_CATEGORY_PERMISSIONS = "user_category_permissions";

export const db = (database) => {
    database.define(
        USER_CATEGORY_PERMISSIONS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            category: {
                type: DataTypes.ENUM,
                values: [USER_CATEGORY.PATIENT, USER_CATEGORY.DOCTOR, USER_CATEGORY.ADMIN, USER_CATEGORY.CARE_TAKER, USER_CATEGORY.PROVIDER],
            },
            permission_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: PERMISSIONS,
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
};

export const associate = (database) => {
    // const {<TABLE_NAME>} = database.models || {};

    // associations here (if any) ...
};
