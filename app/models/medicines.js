"use strict";
import {DataTypes} from "sequelize";
import { MEDICINE_TYPE } from "../../constant";

export const MEDICINES = "medicines";

export const db = (database) => {
    database.define(
        MEDICINES,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            name: {
                type: DataTypes.STRING(1000),
                allowNull: false,
            },
            type: {
                type: DataTypes.ENUM,
                values: [MEDICINE_TYPE.TABLET, MEDICINE_TYPE.INJECTION],
                defaultValue: MEDICINE_TYPE.TABLET
            },
            description: {
                type: DataTypes.STRING(1000),
            },
            pillbox_id: {
                type: DataTypes.INTEGER,
            }
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
