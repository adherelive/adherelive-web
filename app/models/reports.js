"use strict";
import { DataTypes } from "sequelize";
import {TABLE_NAME as patientTableName} from "./patients";
import {USER_CATEGORY} from "../../constant";

export const TABLE_NAME = "reports";

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
            patient_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: patientTableName
                    },
                    key: "id"
                }
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false
            },
            test_date: {
                type: DataTypes.DATEONLY,
                allowNull: false,
            },
            uploader_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            uploader_type: {
                type: DataTypes.ENUM,
                values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.HSP],
                allowNull: false,
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE,
                defaultValue: new Date(),
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = database => {
    // const {TABLE_NAME} = database.models || {};
    // associations here (if any) ...
    database.models[TABLE_NAME].belongsTo(database.models[patientTableName], {
        foreignKey: "patient_id",
        targetKey: "id"
    });
};
