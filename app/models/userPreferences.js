"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as userTableName} from "./users";
import {TABLE_NAME as userRoleTableName} from "./userRoles";

export const TABLE_NAME = "user_preferences";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: userTableName,
                    },
                    key: 'id'
                }
            },
            details: {
                type: DataTypes.JSON,
            },
            user_role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: userRoleTableName,
                    },
                    key: 'id'
                }
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {upload_documents} = database.models || {};

    // associations here (if any) ...
    database.models[TABLE_NAME].belongsTo(database.models[userRoleTableName], {
        foreignKey: "user_role_id",
        targetKey: "id"
    });
};
