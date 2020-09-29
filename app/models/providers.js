"use strict";
import {DataTypes} from "sequelize";

export const PROVIDERS = "providers";

export const db = (database) => {
    database.define(
        PROVIDERS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            address: {
                type: DataTypes.STRING,
            },
            city: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            state: {
                type: DataTypes.STRING,
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
                        name:this.name,
                        address: this.address,
                        city: this.city,
                        state: this.state,
                        activated_on: this.activated_on
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