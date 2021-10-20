"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as patientTableName} from "./patients";
import {TABLE_NAME as doctorTableName} from "./doctors";
import {TABLE_NAME as userRoleTableName} from "./userRoles";

export const TABLE_NAME = "consents";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            type: {
                type: DataTypes.STRING,
                allowNull: false,
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
            patient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: patientTableName,
                    },
                    key: 'id'
                }
            },
            user_role_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: userRoleTableName,
                    },
                    key: 'id'
                }
            },
            details: {
                type: DataTypes.JSON,
            },
            activated_on: {
                type: DataTypes.DATE,
            },
            expired_on: {
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
                        type:this.type,
                        details: this.details,
                        activated_on: this.activated_on,
                        expired_on: this.expired_on
                    };
                }
            }
        }
    );
};

export const associate = (database) => {
    database.models[TABLE_NAME].hasOne(database.models[patientTableName], {
        foreignKey: "id",
        sourceKey: "patient_id"
    });

    database.models[TABLE_NAME].hasOne(database.models[doctorTableName], {
        foreignKey: "id",
        sourceKey: "doctor_id"
    });

    database.models[TABLE_NAME].hasOne(database.models[userRoleTableName], {
        foreignKey: "id",
        sourceKey: "user_role_id"
    });
};