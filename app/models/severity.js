"use strict";
import {DataTypes} from "sequelize";

export const SEVERITY = "severity";

export const db = (database) => {
    database.define(
        SEVERITY,
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
        },
        {
            underscored: true,
            paranoid: true,
            freezeTableName: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        name:this.name,
                    };
                }
            }
        }
    );

};

export const associate = (database) => {
    // const {<TABLE_NAME>} = database.models || {};

    // associations here (if any) ...
};