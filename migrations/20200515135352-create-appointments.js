'use strict';

import {DB_TABLES, GENDER, USER_CATEGORY} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.APPOINTMENTS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      participant_one_type: {
        type: Sequelize.ENUM,
        values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT]
      },
      participant_one_id: {
        type: Sequelize.INTEGER,
      },
      participant_two_type: {
        type: Sequelize.ENUM,
        values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT]
      },
      participant_two_id: {
        type: Sequelize.INTEGER,
      },
      organizer_type: {
        type: Sequelize.ENUM,
        values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.CARE_TAKER]
      },
      organizer_id: {
        type: Sequelize.INTEGER,
      },
      description: {
        type: Sequelize.STRING(1000)
      },
      start_date: {
        type: Sequelize.DATE
      },
      end_date: {
        type: Sequelize.DATE
      },
      rr_rule: {
        type: Sequelize.STRING(1000)
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
    return queryInterface.dropTable(DB_TABLES.APPOINTMENTS);
  }
};
