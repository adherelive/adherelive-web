'use strict';

import {DB_TABLES, USER_CATEGORY} from "../constant";

module.exports = {
    up: (queryInterface, Sequelize) => {
        /*
          Add altering commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
        */
        return queryInterface.createTable(DB_TABLES.MEMBER_SPECIALITIES, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER
            },
            speciality_id: {
                type: Sequelize.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: DB_TABLES.SPECIALITIES,
                    },
                    key: 'id'
                }
            },
            member_type: {
                type: Sequelize.ENUM,
                values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PROVIDER]
            },
            member_id: {
                type: Sequelize.INTEGER,
                allowNull: false
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
        /*
          Add reverting commands here.
          Return a promise to correctly handle asynchronicity.

          Example:
          return queryInterface.dropTable('users');
        */
        return queryInterface.dropTable(DB_TABLES.MEMBER_SPECIALITIES);
    }
};
