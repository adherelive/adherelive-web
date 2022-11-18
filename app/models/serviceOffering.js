"use strict";
import { DataTypes } from "sequelize";
import { CURRENCY, USER_CATEGORY } from "../../constant";

export const TABLE_NAME = "service_offerings";

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
      service_offering_name: {
        type: DataTypes.STRING(1000),
        allowNull: false,
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
      is_active: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      payment_link: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      service_charge: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      currency: {
        type: DataTypes.ENUM,
        values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
        allowNull: false,
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
            doctor_id: this.doctor_id,
            description: this.description,
            provider_type: this.provider_type,
            subscription_charge: this.subscription_charge,
            currency: this.currency,
            payment_link: this.payment_link,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // const {TABLE_NAME} = database.models || {};
  // associations here (if any) ...
};
