'use strict';

import {TABLE_NAME} from "../app/models/patients";
import {TABLE_NAME as userTableName} from "../app/models/users";
import {GENDER, BLANK_STATE} from "../constant";

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
            gender: {
                type: Sequelize.ENUM,
                values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER, BLANK_STATE],
                defaultValue: BLANK_STATE,
            },
            first_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            middle_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            last_name: {
                type: Sequelize.STRING(100),
                allowNull: true,
            },
            age: {
                type: Sequelize.STRING,
            },
            dob: {
                type: Sequelize.DATE,
                allowNull: true,
            },
            address: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            height: {
                type: Sequelize.STRING,
                allowNull: true
            },
            weight: {
                type: Sequelize.STRING,
                allowNull: true
            },
            height: {
                type: Sequelize.STRING,
                allowNull: true
            },
            weight: {
                type: Sequelize.STRING,
                allowNull: true
            },
            activated_on: {
                type: Sequelize.DATE
            },
            uid: {
                type: Sequelize.STRING,
            },
            details: {
                type: Sequelize.JSON,
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
