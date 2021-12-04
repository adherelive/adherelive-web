"use strict";
import {DataTypes} from "sequelize";
import {CURRENCY, REPEAT_TYPE, USER_CATEGORY} from "../../constant";

export const PRODUCT_PLANS = "product_plans";

export const db = (database) => {
  database.define(
    PRODUCT_PLANS,
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
      provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      subscription_charge: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      currency: {
        type: DataTypes.ENUM,
        values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
        allowNull: false,
      },
      billing_cycle: {
        type: DataTypes.ENUM,
        values: [
          REPEAT_TYPE.YEARLY,
          REPEAT_TYPE.MONTHLY,
          REPEAT_TYPE.WEEKLY,
          REPEAT_TYPE.DAILY,
        ],
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
            description: this.description,
            provider_type: this.provider_type,
            subscription_charge: this.subscription_charge,
            currency: this.currency,
            billing_cycle: this.billing_cycle,
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
