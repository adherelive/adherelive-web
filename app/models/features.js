"use strict";
import {DataTypes} from "sequelize";

export const FEATURES = "features";

export const db = (database) => {
    database.define(
        FEATURES,
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
            description: {
                type: DataTypes.STRING(1000),
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
                        description: this.description
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