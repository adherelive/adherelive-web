"use strict";
import {DataTypes} from "sequelize";
import {DOCTORS} from "./doctors";
import {REGISTRATION_COUNCIL} from "./registrationCouncil";

export const DOCTOR_REGISTRATIONS = "doctor_registrations";

export const db = (database) => {
    database.define(
        DOCTOR_REGISTRATIONS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            doctor_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: DOCTORS,
                    },
                    key: 'id'
                }
            },
            number: {
                type: DataTypes.STRING(100),
                allowNull: false,
            },
            registration_council_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: REGISTRATION_COUNCIL,
                    },
                    key: 'id'
                }
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            expiry_date: {
                type: DataTypes.DATE,
                allowNull: false
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    const {doctors, doctor_registrations} = database.models || {};

    // associations here (if any) ...
    doctor_registrations.belongsTo(doctors, {
        foreignKey:"doctor_id",
        targetKey:"id"
    });
};
