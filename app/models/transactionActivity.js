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
import { TABLE_NAME as serviceOffering } from "./serviceOffering";
import { TABLE_NAME as serviceSubscription } from "./serviceSubscriptions";
import { TABLE_NAME as providersTableName } from "./providers";
import { TABLE_NAME as appointmentTableName } from "./appointments";
import { TABLE_NAME as serviceSubTxTableName } from "./serviceSubscribeTransaction";

export const TABLE_NAME = "tranaction_activities";

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
      service_sub_tx_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: serviceSubTxTableName,
          },
          key: "id",
        },
      },
      appointment_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: appointmentTableName,
          },
          key: "id",
        },
      },
      appointment_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      due_date: {
        type: DataTypes.DATE,
      },
      status: {
        type: DataTypes.ENUM,
        values: ["pending", "scheduled"],
      },
      service_offering_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: serviceOffering,
          },
          key: "id",
        },
      },
      activity_status: {
        type: DataTypes.ENUM,
        values: ["inprogress", "notstarted", "completed"],
        defaultValue: "notstarted",
      },
      service_subscription_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: serviceSubscription,
          },
          key: "id",
        },
      },
      patient_status: {
        type: DataTypes.ENUM,
        values: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
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
      is_next_tx_create: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false,
      },
      is_reassigned: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      data: {
        type: DataTypes.JSON,
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
            service_subscription_id: this.service_subscription_id,
            billing_frequency: this.billing_frequency,
            due_date: this.due_date,
            is_next_tx_create: this.is_next_tx_create,
            appointment_id: this.appointment_id,
            appointment_time: this.appointment_time,
            service_sub_tx_id: this.service_sub_tx_id,
            is_reassigned: this.is_reassigned || false,
            data: this.data || {},
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
  // service_sub_tx_id

  database.models[TABLE_NAME].belongsTo(
    database.models[serviceSubTxTableName],
    {
      foreignKey: "service_sub_tx_id",
      targetKey: "id",
    }
  );

  database.models[TABLE_NAME].belongsTo(database.models[doctorsTableName], {
    foreignKey: "doctor_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].belongsTo(database.models[providersTableName], {
    foreignKey: "provider_id",
    targetKey: "id",
  });
  database.models[TABLE_NAME].belongsTo(database.models[serviceOffering], {
    foreignKey: "service_offering_id",
    targetKey: "id",
  });
  database.models[TABLE_NAME].belongsTo(database.models[appointmentTableName], {
    foreignKey: "appointment_id",
    targetKey: "id",
  });
};
