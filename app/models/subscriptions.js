"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY} from "../../constant";

const Subscriptions = database.define(
    DB_TABLES.SUBSCRIPTIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        product_plan_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.PRODUCT_PLANS,
                },
                key: 'id'
            }
        },
        subscriber_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.PATIENT],
            allowNull: false
        },
        subscriber_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        activated_on: {
            type: Sequelize.DATE
        },
        renew_on: {
            type: Sequelize.DATE
        },
        expired_on: {
            type: Sequelize.DATE,
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

export default Subscriptions;
