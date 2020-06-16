"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES, USER_CATEGORY, SIGN_IN_CATEGORY } from "../../constant";

const Users = database.define(
    DB_TABLES.USERS,
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_name: {
            type: Sequelize.STRING(100),
            unique: true,
            allowNull: true
        },
        email: {
            type: Sequelize.STRING,
            allow_null: true,
            unique: true,
            set(val) {
                this.setDataValue("email", val.toLowerCase());
            }
        },
        prefix: {
            type: Sequelize.STRING,
            allowNull: true
        },
        mobile_number: {
            type: Sequelize.STRING,
            unique: true,
            allow_null: true,
        },
        password: {
            type: Sequelize.STRING(1000),
            required: true
        },
        sign_in_type: {
            type: Sequelize.ENUM,
            values: [
                SIGN_IN_CATEGORY.BASIC,
                SIGN_IN_CATEGORY.GOOGLE,
                SIGN_IN_CATEGORY.FACEBOOK
            ],
            required: true
        },
        category: {
            type: Sequelize.ENUM,
            values: [
                USER_CATEGORY.DOCTOR,
                USER_CATEGORY.PATIENT,
                USER_CATEGORY.CARE_TAKER,
                USER_CATEGORY.PROVIDER,
                USER_CATEGORY.ADMIN
            ],
            required: true
        },
        activated_on: {
            type: Sequelize.DATE
        },
        onboarded: {
            type: Sequelize.BOOLEAN
        },
        onboarding_status: {
            type: Sequelize.STRING,
            allowNull: true
        },
        verified: {
            type: Sequelize.BOOLEAN,
            defaultValue: false
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    user_id: this.id,
                    user_name: this.user_name,
                    email: this.email,
                    mobile_number: this.mobile_number,
                    sign_in_type: this.sign_in_type,
                    category: this.category,
                    activated_on: this.activated_on,
                    onboarded: this.onboarded,
                    onboarding_status: this.onboarding_status,
                    mobile_number: this.mobile_number,
                    prefix: this.prefix,
                    verified:this.verified

                };
            }
        }
    }
);

export default Users;
