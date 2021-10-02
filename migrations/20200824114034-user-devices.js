'use strict';

import {TABLE_NAME} from "../app/models/userDevices";
import {TABLE_NAME as userTableName} from "../app/models/users";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            user_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: userTableName,
                    },
                    key: 'id'
                }
            },
            platform: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            one_signal_user_id: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            push_token: {
                type: Sequelize.STRING,
                allowNull: false,
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
