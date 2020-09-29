"use strict";
import {DataTypes} from "sequelize";

export const CONSENTS = "consents";

export const db = (database) => {
    database.define(
        CONSENTS,
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
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...
};