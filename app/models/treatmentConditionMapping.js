"use strict";
import {DataTypes} from "sequelize";
import {CONDITIONS} from "./conditions";
import {TREATMENTS} from "./treatments";

export const TREATMENT_CONDITION_MAPPING = "treatment_condition_mappings";

export const db = (database) => {
    database.define(
        TREATMENT_CONDITION_MAPPING,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            condition_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: CONDITIONS,
                    },
                    key: 'id'
                }
            },
            treatment_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: TREATMENTS,
                    },
                    key: 'id'
                }
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
