"use strict";
import {DataTypes} from "sequelize";

export const TABLE_NAME = "specialities";

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
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            description: {
                type: DataTypes.STRING(1000),
            },
            user_created: {
                type: DataTypes.INTEGER,
                allowNull: true,
                defaultValue:null
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};


export const associate = (database) => {
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...
    // Specialities.belongsTo(Doctors, {
    //     foreignKey: "speciality_id",
    //     targetKey:"id"
    // });
};