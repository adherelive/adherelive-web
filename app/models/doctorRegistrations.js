"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as doctorTableName} from "./doctors";
import {TABLE_NAME as registrationCouncilTableName} from "./registrationCouncil";

export const TABLE_NAME = "doctor_registrations";

export const db = (database) => {
    database.define(
        TABLE_NAME,
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
                        tableName: doctorTableName,
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
                        tableName: registrationCouncilTableName,
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
        foreignKey: "doctor_id",
        targetKey: "id"
    });
};
