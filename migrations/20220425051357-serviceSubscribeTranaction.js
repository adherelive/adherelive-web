"use strict";
import { TABLE_NAME } from "../app/models/serviceSubscribeTranaction";
import { TABLE_NAME as subscribePlanTableName } from "../app/models/serviceSubscriptionUserMapping";
import { TABLE_NAME as servicePlanTableName } from "../app/models/serviceUserMapping";
import { TABLE_NAME as patientsTableName } from "../app/models/patients";
import { TABLE_NAME as doctorsTableName } from "../app/models/doctors";
import { TABLE_NAME as providersTableName } from "../app/models/providers";
import {
  USER_CATEGORY,
  CURRENCY,
  USER_STATUS,
  BILLING_FREQUENCY,
} from "../constant";

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
        references: {
          model: {
            tableName: patientsTableName,
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
      description: {
        type: Sequelize.STRING(1000),
        allowNull: true,
      },
      currency: {
        type: Sequelize.ENUM,
        values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
        allowNull: true,
      },
      subscription_user_plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: subscribePlanTableName,
          },
          key: "id",
        },
      },
      service_user_plan_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: servicePlanTableName,
          },
          key: "id",
        },
      },
      patient_status: {
        type: Sequelize.ENUM,
        values: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "submitted"],
      },
      amount: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      refound_amount: {
        type: Sequelize.INTEGER,
      },
      billing_frequency: {
        type: Sequelize.ENUM,
        values: [BILLING_FREQUENCY.ONCES, BILLING_FREQUENCY.MONTHLY],
      },
      due_date: {
        type: Sequelize.DATE,
      },
      is_next_tx_create: {
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

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
