"use strict";
import { DataTypes } from "sequelize";
import { CURRENCY, REPEAT_TYPE, USER_CATEGORY } from "../../constant";
import { TABLE_NAME as serviceOfferingTable } from "./serviceOffering";
export const TABLE_NAME = "service_subscriptions";

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
      doctor_id: {
        type: DataTypes.INTEGER,
      },
      provider_id: {
        type: DataTypes.INTEGER,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      notes: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      service_charge_per_month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.ENUM,
        values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
        allowNull: false,
      },
      is_active_for_doctor: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      // services: {
      //     type: DataTypes.INTEGER,
      //     allowNull: false,
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
            notes: this.notes,
            description: this.description,
            provider_type: this.provider_type,
            service_charge_per_month: this.service_charge_per_month,
            currency: this.currency,
            isActiveForDoctor: this.isActiveForDoctor,
          };
        },
      },
    }
  );
};

export const associate = (database) => {};
