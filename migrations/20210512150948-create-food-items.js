"use strict";

import {TABLE_NAME} from "../app/models/foodItems";
import {TABLE_NAME as portionTableName} from "../app/models/portions";
import {USER_CATEGORY_ARRAY} from "../app/models/users";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            name: {
                type: Sequelize.STRING,
                allowNull: false,
            },
            creator_id: {
                type: Sequelize.INTEGER,
            },
            creator_type: {
                type: Sequelize.ENUM,
                values: USER_CATEGORY_ARRAY
            },
            created_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updated_at: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            deleted_at: {
                allowNull: true,
                type: Sequelize.DATE,
            },
        });
    },

    down: (queryInterface, Sequelize) => {
        return queryInterface.dropTable(TABLE_NAME);
    },
};
