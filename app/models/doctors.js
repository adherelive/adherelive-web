"use strict";
import {DataTypes} from "sequelize";
import {USERS} from "./users";
import {SPECIALITIES} from "./specialities";
import {
  GENDER,
} from "../../constant";

export const DOCTORS = "doctors";

export const db = (database) => {
    database.define(
        DOCTORS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: USERS,
                    },
                    key: "id",
                },
            },
            city: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            speciality_id: {
                type: DataTypes.INTEGER,
                allowNull: true,
                references: {
                    model: {
                        tableName: SPECIALITIES,
                    },
                    key: 'id'
                }
            },
            gender: {
                type: DataTypes.ENUM,
                values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
                allowNull: true,
            },
            profile_pic: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            first_name: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            middle_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            last_name: {
                type: DataTypes.STRING(100),
                allowNull: true,
            },
            activated_on: {
                type: DataTypes.DATE,
            },
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        user_id: this.user_id,
                        gender: this.gender,
                        profile_pic: this.profile_pic,
                        first_name: this.first_name,
                        middle_name: this.middle_name,
                        last_name: this.last_name,
                        address: this.address,
                        city: this.city,
                        speciality: this.speciality,
                        registration_council: this.registration_council,
                        registration_year: this.registration_year,
                        registration_number: this.registration_number,
                        activated_on: this.activated_on,
                    };
                },
            },
        }
    );
};

export const associate = (database) => {
    const {doctors, specialities} = database.models || {};

    // associations here (if any) ...
    doctors.hasOne(specialities, {
        foreignKey: "id",
        sourceKey:"speciality_id"
    });
};
