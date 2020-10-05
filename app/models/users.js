"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as UserCategoryPermissionTableName} from "./userCategoryPermissions";
import { USER_CATEGORY, SIGN_IN_CATEGORY } from "../../constant";

export const TABLE_NAME = "users";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_name: {
                type: DataTypes.STRING(100),
                unique: true,
                allowNull: true
            },
            email: {
                type: DataTypes.STRING,
                allow_null: true,
                unique: true,
                set(val) {
                    this.setDataValue("email", val.toLowerCase());
                }
            },
            prefix: {
                type: DataTypes.STRING,
                allowNull: true
            },
            mobile_number: {
                type: DataTypes.STRING,
                unique: true,
                allow_null: true,
            },
            password: {
                type: DataTypes.STRING(1000),
                required: true
            },
            sign_in_type: {
                type: DataTypes.ENUM,
                values: [
                    SIGN_IN_CATEGORY.BASIC,
                    SIGN_IN_CATEGORY.GOOGLE,
                    SIGN_IN_CATEGORY.FACEBOOK
                ],
                required: true
            },
            category: {
                type: DataTypes.ENUM,
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
                type: DataTypes.DATE
            },
            onboarded: {
                type: DataTypes.BOOLEAN
            },
            onboarding_status: {
                type: DataTypes.STRING,
                allowNull: true
            },
            verified: {
                type: DataTypes.BOOLEAN,
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
                        prefix: this.prefix,
                        verified:this.verified

                    };
                }
            }
        }
    );
};


export const associate = (database) => {
    const {users, doctors, patients, permissions, user_devices} = database.models || {};

    // associations here (if any) ...
    users.hasOne(doctors, {
        sourceKey:"id",
        foreignKey:"user_id"
    });

    users.hasOne(patients, {
        sourceKey:"id",
        foreignKey:"user_id"
    })

    users.belongsToMany(permissions, {
        through: UserCategoryPermissionTableName,
        sourceKey:"category",
        foreignKey:"category"
    });

    users.hasMany(user_devices, {
        sourceKey:"id",
        foreignKey:"user_id"
    });
};
