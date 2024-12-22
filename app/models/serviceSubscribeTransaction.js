"use strict";
import { DataTypes } from "sequelize";
import {
  CURRENCY,
  REPEAT_TYPE,
  USER_CATEGORY,
  USER_STATUS,
  BILLING_FREQUENCY,
} from "../../constant";
import { TABLE_NAME as serviceUserMapping } from "./serviceUserMapping";
import { TABLE_NAME as patientsTableName } from "./patients";
import { TABLE_NAME as doctorsTableName } from "./doctors";
import { TABLE_NAME as serviceSubscriptionUserMapping } from "./serviceSubscriptionUserMapping";
import { TABLE_NAME as providersTableName } from "./providers";

export const TABLE_NAME = "service_subscription_transactions";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      provider_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.HSP,
        ],
      },
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: patientsTableName,
          },
          key: "id",
        },
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: doctorsTableName,
          },
          key: "id",
        },
      },
      provider_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: providersTableName,
          },
          key: "id",
        },
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: true,
      },
      currency: {
        type: DataTypes.ENUM,
        values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
        allowNull: true,
      },
      subscription_user_plan_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: serviceSubscriptionUserMapping,
          },
          key: "id",
        },
      },
      service_user_plan_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: serviceUserMapping,
          },
          key: "id",
        },
      },
      patient_status: {
        type: DataTypes.ENUM,
        values: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "submitted"],
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      refound_amount: {
        type: DataTypes.INTEGER,
      },
      billing_frequency: {
        type: DataTypes.ENUM,
        values: [BILLING_FREQUENCY.ONCES, BILLING_FREQUENCY.MONTHLY],
      },
      due_date: {
        type: DataTypes.DATE,
      },
      is_next_tx_create: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            provider_id: this.provider_id,
            patient_id: this.patient_id,
            doctor_id: this.doctor_id,
            provider_type: this.provider_type,
            description: this.description,
            currency: this.currency,
            service_user_plan_id: this.service_plan_id,
            subscription_user_plan_id: this.subscription_plan_id,
            patient_status: this.patient_status,
            status: this.status,
            amount: this.amount,
            refound_amount: this.refound_amount,
            billing_frequency: this.billing_frequency,
            due_date: this.due_date,
            is_next_tx_create: this.is_next_tx_create,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  database.models[TABLE_NAME].belongsTo(database.models[patientsTableName], {
    foreignKey: "patient_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].belongsTo(database.models[doctorsTableName], {
    foreignKey: "doctor_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].belongsTo(database.models[providersTableName], {
    foreignKey: "provider_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].belongsTo(database.models[serviceUserMapping], {
    foreignKey: "service_user_plan_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].belongsTo(
    database.models[serviceSubscriptionUserMapping],
    {
      foreignKey: "subscription_user_plan_id",
      targetKey: "id",
    }
  );
};
