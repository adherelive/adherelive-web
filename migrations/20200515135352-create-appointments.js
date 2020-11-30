"use strict";

import { TABLE_NAME } from "../app/models/appointments";
import { USER_CATEGORY } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
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
        type: Sequelize.INTEGER
      },
      participant_two_type: {
        type: Sequelize.ENUM,
        values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT]
      },
      participant_two_id: {
        type: Sequelize.INTEGER
      },
      organizer_type: {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.CARE_TAKER
        ]
      },
      organizer_id: {
        type: Sequelize.INTEGER
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: true
      },
      provider_name: {
        type: Sequelize.STRING(100),
        allowNull: true
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
      start_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      end_time: {
        type: Sequelize.DATE,
        allowNull: true
      },
      rr_rule: {
        type: Sequelize.STRING(1000)
      },
      details: {
        type: Sequelize.JSON
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
