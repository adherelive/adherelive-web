"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import {CURRENCY, DB_TABLES, REPEAT_TYPE, USER_CATEGORY} from "../../constant";

const ProductPlans = database.define(
    DB_TABLES.PRODUCT_PLANS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        provider_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PROVIDER]
        },
        provider_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        description: {
            type: Sequelize.STRING(1000),
            allowNull: false
        },
        subscription_charge: {
            type: Sequelize.STRING,
            allowNull: false
        },
        currency: {
            type: Sequelize.ENUM,
            values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
            allowNull: false
        },
        billing_cycle: {
            type: Sequelize.ENUM,
            values: [REPEAT_TYPE.YEARLY, REPEAT_TYPE.MONTHLY, REPEAT_TYPE.WEEKLY, REPEAT_TYPE.DAILY],
            allowNull: false
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    provider_id:this.provider_id,
                    description:this.description,
                    provider_type:this.provider_type,
                    subscription_charge:this.subscription_charge,
                    currency:this.currency,
                    billing_cycle:this.billing_cycle,
                };
            }
        }
    }
);

export default ProductPlans;
