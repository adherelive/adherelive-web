"use strict";
import {DataTypes} from "sequelize";
import {PRODUCT_PLANS} from "./productPlans";
import {USER_CATEGORY} from "../../constant";

export const SUBSCRIPTIONS = "subscriptions";

export const db = (database) => {
    database.define(
        SUBSCRIPTIONS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            product_plan_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: PRODUCT_PLANS,
                    },
                    key: 'id'
                }
            },
            subscriber_type: {
                type: DataTypes.ENUM,
                values: [USER_CATEGORY.PATIENT],
                allowNull: false
            },
            subscriber_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            activated_on: {
                type: DataTypes.DATE
            },
            renew_on: {
                type: DataTypes.DATE
            },
            expired_on: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        product_plan_id:this.product_plan_id,
                        subscriber_type:this.subscriber_type,
                        subscriber_id:this.subscriber_id,
                        activated_on:this.activated_on,
                        renew_on:this.renew_on,
                        expired_on:this.expired_on,
                    };
                }
            }
        }
    );
};


export const associate = (database) => {
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...
};