"use strict";
import { TABLE_NAME as patientsTableName } from "../app/models/patients";
import { TABLE_NAME as doctorsTableName } from "../app/models/doctors";
import { TABLE_NAME as providersTableName } from "../app/models/providers";
import { TABLE_NAME as transactionActivityTableName } from "../app/models/transactionActivity";
import { USER_CATEGORY } from "../constant";
import { TABLE_NAME } from "../app/models/flashCard";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: patientsTableName,
          },
          key: "id",
        },
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: doctorsTableName,
          },
          key: "id",
        },
      },
      provider_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: providersTableName,
          },
          key: "id",
        },
      },
      tx_activity_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: transactionActivityTableName,
          },
          key: "id",
        },
      },
      provider_type: {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.HSP,
        ],
      },
      notes: {
        type: Sequelize.JSON,
      },

      data: {
        type: Sequelize.JSON,
      },
      is_published: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
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

  down: (queryInterface, Sequelize) => {},
};
