"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as UserCategoryPermissionTableName} from "./userCategoryPermissions";
import {TABLE_NAME as providerTableName} from "./providers";
import {SIGN_IN_CATEGORY, USER_CATEGORY} from "../../constant";

export const TABLE_NAME = "users";

export const USER_CATEGORY_ARRAY = [
    USER_CATEGORY.DOCTOR,
    USER_CATEGORY.HSP,
    USER_CATEGORY.PATIENT,
    USER_CATEGORY.CARE_TAKER,
    USER_CATEGORY.PROVIDER,
    USER_CATEGORY.ADMIN
];

export const db = database => {
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
                // unique: true,
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
                // unique: true,
                allow_null: true
            },
            password: {
                type: DataTypes.STRING(1000),
                allowNull: true
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
                    USER_CATEGORY.ADMIN,
                    USER_CATEGORY.HSP
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
            // system_generated_password: {
            //   type: DataTypes.BOOLEAN,
            //   defaultValue: false
            // },

            has_consent: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            deleted_at: {
                type: DataTypes.DATE
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
                        verified: this.verified,
                        deleted_at: this.deleted_at,
                        has_consent: this.has_consent
                        // system_generated_password: this.system_generated_password
                    };
                }
            }
        }
    );
};

export const associate = database => {
    const {
        users,
        doctors,
        patients,
        permissions,
        user_devices,
        account_details
    } = database.models || {};

    // associations here (if any) ...
    users.hasOne(doctors, {
        sourceKey: "id",
        foreignKey: "user_id"
    });

    users.hasOne(patients, {
        sourceKey: "id",
        foreignKey: "user_id"
    });

    database.models[TABLE_NAME].hasOne(database.models[providerTableName], {
        sourceKey: "id",
        foreignKey: "user_id"
    });

    users.belongsToMany(permissions, {
        through: UserCategoryPermissionTableName,
        sourceKey: "category",
        foreignKey: "category"
    });

    users.hasMany(user_devices, {
        sourceKey: "id",
        foreignKey: "user_id"
    });

    users.hasMany(account_details, {
        sourceKey: "id",
        foreignKey: "user_id"
    });
};
