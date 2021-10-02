"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as doctorTableName} from "./doctors";
import {TABLE_NAME as providerTableName} from "./providers";

export const TABLE_NAME = "doctor_provider_mappings";

export const db = database => {
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
                        tableName: doctorTableName
                    },
                    key: "id"
                }
            },
            provider_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: providerTableName
                    },
                    key: "id"
                }
            }
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        doctor_id: this.doctor_id,
                        provider_id: this.provider_id
                    };
                },
                getId() {
                    return this.id;
                }
            }
        }
    );
};

export const associate = database => {
    // associations here (if any) ...
    database.models[TABLE_NAME].hasOne(database.models[doctorTableName], {
        foreignKey: "id",
        targetKey: "doctor_id"
    });
};
