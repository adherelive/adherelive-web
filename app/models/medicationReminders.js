"use strict";
import {DataTypes} from "sequelize";
import {USER_CATEGORY} from "../../constant";
import {MEDICINES} from "./medicines";

export const MEDICATIONS = "medications";

export const db = (database) => {
    database.define(
        MEDICATIONS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            participant_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            organizer_type: {
                type: DataTypes.ENUM,
                values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.CARE_TAKER]
            },
            organizer_id: {
                type: DataTypes.INTEGER,
                allowNull: false
            },
            medicine_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: MEDICINES,
                    },
                    key: "id",
                },
            },
            description: {
                type: DataTypes.STRING(1000)
            },
            start_date: {
                type: DataTypes.DATE
            },
            end_date: {
                type: DataTypes.DATE
            },
            rr_rule: {
                type: DataTypes.STRING(1000)
            },
            details: {
                type: DataTypes.JSON,
            }
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        participant_id: this.participant_id,
                        organizer_type: this.organizer_type,
                        organizer_id: this.organizer_id,
                        description: this.description,
                        start_date: this.start_date,
                        end_date: this.end_date,
                        rr_rule: this.rr_rule,
                        details: this.details,
                    };
                },
                getId() {
                    return this.id;
                }
            }
        }
    );
};

export const associate = (database) => {
    const {medications, medicines} = database.models || {};

    // associations here (if any) ...
    medications.hasOne(medicines, {
        sourceKey:"medicine_id",
        foreignKey:"id"
    });

};
