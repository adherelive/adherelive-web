"use strict";
import {DataTypes} from "sequelize";
import {DOCTORS} from "./doctors";
import {DEGREES} from "./degree";
import {COLLEGES} from "./college";

export const DOCTOR_QUALIFICATIONS = "doctor_qualifications";

export const db = (database) => {
    database.define(
        DOCTOR_QUALIFICATIONS,
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
            degree_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: DEGREES,
                    },
                    key: 'id'
                }
            },
            college_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: COLLEGES,
                    },
                    key: 'id'
                }
            },
            year: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            // photos:{
            //   type: DataTypes.JSON
            // }
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        doctor_id: this.doctor_id,
                        degree: this.degree,
                        year: this.year,
                        college: this.college,
                        // photos: this.photos
                    };
                }
            }
        }
    );
};

export const associate = (database) => {
    const {doctors, doctor_qualifications} = database.models || {};

    // associations here (if any) ...
    doctor_qualifications.belongsTo(doctors, {
        foreignKey:"doctor_id",
        targetKey:"id"
    });
};
