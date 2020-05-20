"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";

const PatientCareTakers = database.define(
    DB_TABLES.PATIENT_CARE_TAKERS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        patient_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        care_taker_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        consent_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    patient_id: this.patient_id,
                    care_taker_id: this.care_taker_id,
                    consent_id: this.consent_id
                };
            }
        }
    }
);

export default PatientCareTakers;
