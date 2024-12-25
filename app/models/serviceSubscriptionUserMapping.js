"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as patientsTableName } from "./patients";
import { TABLE_NAME as doctorsTableName } from "./doctors";
import { TABLE_NAME as serviceOfferingTableName } from "./serviceOffering";
import { TABLE_NAME as serviceSubscriptionPlanTableName } from "./serviceSubscriptions";
import { TABLE_NAME as providersTableName } from "./providers";
import {
  CURRENCY,
  USER_CATEGORY,
  USER_STATUS,
  PATIENT_STATUS,
} from "../../constant";

export const TABLE_NAME = "service_subscription_user_mappings";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
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
      provider_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.HSP,
        ],
      },
      service_charge: {
        type: DataTypes.INTEGER,
      },
      notes: {
        type: DataTypes.STRING(1000),
      },
      service_subscription_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: serviceSubscriptionPlanTableName,
          },
          key: "id",
        },
      },
      durations: {
        type: DataTypes.INTEGER,
      },

      service_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      next_recharge_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      expire_date: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      patient_status: {
        type: DataTypes.ENUM,
        values: [
          PATIENT_STATUS.ACTIVE,
          PATIENT_STATUS.INACTIVE,
          PATIENT_STATUS.COMPLETED,
          PATIENT_STATUS.INPROGRESS,
        ],
      },
      // is_patient_activated: {
      //   type: DataTypes.ENUM,
      //   values: [USER_STATUS.ACTIVE, USER_STATUS.INACTIVE],
      // },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            provider_id: this.provider_id,
            terms_and_conditions_id: this.terms_and_conditions_id,
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

  database.models[TABLE_NAME].belongsTo(
    database.models[serviceSubscriptionPlanTableName],
    {
      foreignKey: "service_subscription_plan_id",
      targetKey: "id",
    }
  );
};
