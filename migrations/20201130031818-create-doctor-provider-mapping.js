"use strict";

import {TABLE_NAME} from "../app/models/doctorProviderMapping";
import {TABLE_NAME as providerTableName} from "../app/models/providers";
import {TABLE_NAME as doctorTableName} from "../app/models/doctors";
import {DataTypes} from "sequelize";

module.exports = {
    up: (queryInterface, Sequelize) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            doctor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: doctorTableName
                    },
                    key: "id"
                }
            },
            provider_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: providerTableName
                    },
                    key: "id"
                }
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
