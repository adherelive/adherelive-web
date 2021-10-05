'use strict';
import {DataTypes} from "sequelize";
import {PAYMENT_PRODUCT_TYPES, PRODUCT_USER_TYPES, TABLE_NAME} from "../app/models/paymentProducts";
import {USER_CATEGORY_ARRAY} from "../app/models/users";

module.exports = {
    up: (queryInterface) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true,
                allowNull: false,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            type: {
                type: DataTypes.ENUM,
                values: PAYMENT_PRODUCT_TYPES,
                allowNull: false
            },
            amount: {
                type: DataTypes.INTEGER,
            },
            creator_id: {
                type: DataTypes.INTEGER,
                // allowNull: false
            },
            creator_type: {
                type: DataTypes.ENUM,
                values: USER_CATEGORY_ARRAY,
                allowNull: false
            },
            product_user_type: {
                type: DataTypes.ENUM,
                values: PRODUCT_USER_TYPES,
            },
            details: {
                type: DataTypes.JSON,
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
            },
            deleted_at: {
                type: DataTypes.DATE,
            },
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable(TABLE_NAME);
    }
};
