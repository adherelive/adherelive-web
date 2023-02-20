"use strict";
import { TABLE_NAME } from "../app/models/transactionActivity";
import { TABLE_NAME as serviceOfferingTableName } from "../app/models/serviceOffering";
import { TABLE_NAME as patientsTableName } from "../app/models/patients";
import { TABLE_NAME as doctorsTableName } from "../app/models/doctors";
import { TABLE_NAME as providersTableName } from "../app/models/providers";
import { TABLE_NAME as appointmentsTableName } from "../app/models/appointments";
import { TABLE_NAME as serviceSubTxTableName } from "../app/models/serviceSubscribeTranaction";
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
      service_sub_tx_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: serviceSubTxTableName,
          },
          key: "id",
        },
      },
      due_date: {
        type: Sequelize.DATE,
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "scheduled"],
      },
      service_offering_id: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: serviceOfferingTableName,
          },
          key: "id",
        },
      },
      appointment_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: appointmentsTableName,
          },
          key: "id",
        },
      },
      service_subscription_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: serviceOfferingTableName,
          },
          key: "id",
        },
      },

      currency: {
        type: Sequelize.ENUM,
        values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
        allowNull: true,
      },
      patient_status: {
        type: Sequelize.ENUM,
        values: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
      },
      status: {
        type: Sequelize.ENUM,
        values: ["pending", "scheduled"],
      },
      activity_status: {
        type: Sequelize.ENUM,
        values: ["inprogress", "notstarted", "completed"],
        defaultValue: "notstarted",
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

      is_next_tx_create: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
      },
      appointment_time: {
        allowNull: true,
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
