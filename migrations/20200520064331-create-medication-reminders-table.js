"use strict";

import { USER_CATEGORY } from "../constant";
import { TABLE_NAME } from "../app/models/medicationReminders";
import { TABLE_NAME as medicineTableName } from "../app/models/medicines";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
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
      medicine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: medicineTableName,
          },
          key: "id",
        },
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
      details: {
        type: Sequelize.JSON,
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
