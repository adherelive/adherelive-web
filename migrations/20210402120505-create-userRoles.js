"use strict";

import {TABLE_NAME} from "../app/models/userRoles";

import {TABLE_NAME as userTableName} from "../app/models/users";
import {USER_CATEGORY} from "../constant";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                type: Sequelize.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_identity: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: userTableName
                    },
                    key: "id"
                }
            },
            linked_with: {
                type: Sequelize.ENUM,
                values: [USER_CATEGORY.PROVIDER, USER_CATEGORY.ADMIN],
                allowNull: true,
            },
            linked_id: {
                type: Sequelize.INTEGER,
                allowNull: true,
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE
            }
        });
    },
    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(TABLE_NAME);
    }
};
