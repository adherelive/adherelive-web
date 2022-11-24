"use strict";
import { TABLE_NAME } from "../app/models/serviceSubscriptionUserMapping";
import { TABLE_NAME as subscribePlanTableName } from "../app/models/serviceSubecriptions";
import { TABLE_NAME as patientsTableName } from "../app/models/patients";
import { TABLE_NAME as doctorsTableName } from "../app/models/doctors";
import { TABLE_NAME as providersTableName } from "../app/models/providers";
import {
  DB_TABLES,
  USER_CATEGORY,
  PATIENT_STATUS,
  USER_STATUS,
  CURRENCY,
  BILLING_CYCLE,
  REPEAT_TYPE,
} from "../constant";
//
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
      provider_type: {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.HSP,
        ],
      },
      service_charge: {
        type: Sequelize.INTEGER,
      },
      notes: {
        type: Sequelize.STRING(1000),
      },
      service_subscription_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: subscribePlanTableName,
          },
          key: "id",
        },
      },
      durations: {
        type: Sequelize.INTEGER,
      },
      service_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      patient_status: {
        type: Sequelize.ENUM,
        values: [
          PATIENT_STATUS.ACTIVE,
          PATIENT_STATUS.INACTIVE,
          PATIENT_STATUS.COMPLETED,
          PATIENT_STATUS.INPROGRESS,
        ],
      },
      // is_patient_activated: {
      //   type: Sequelize.ENUM,
      //   values: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
      // },
      next_recharge_date: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      expire_date: {
        allowNull: false,
        type: Sequelize.DATE,
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
