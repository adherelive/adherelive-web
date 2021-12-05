"use strict";

import {DB_TABLES, USER_CATEGORY} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
                          Add altering commands here.
                          Return a promise to correctly handle asynchronicity.

                          Example:
                          return queryInterface.createTable('users', { id: Sequelize.INTEGER });
            */
    return queryInterface.createTable(DB_TABLES.REMINDERS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      participant_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      organizer_type: {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.CARE_TAKER,
          USER_CATEGORY.HSP,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
      },
      organizer_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(1000),
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
        type: Sequelize.DATE,
      },
      rr_rule: {
        type: Sequelize.STRING(1000),
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
    /*
                          Add reverting commands here.
                          Return a promise to correctly handle asynchronicity.

                          Example:
                          return queryInterface.dropTable('users');
            */
    return queryInterface.dropTable(DB_TABLES.REMINDERS);
  },
};
