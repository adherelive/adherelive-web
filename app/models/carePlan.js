"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import Doctors from "./doctors";
import Patients from "./patients";
import Conditions from "./conditions";
import Consents from "./consents";

const CarePlan = database.define(
    DB_TABLES.CARE_PLANS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        // condition_id: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: {
        //             tableName: DB_TABLES.CONDITIONS,
        //         },
        //         key: 'id'
        //     }
        // },
        // consent_id: {
        //     type: Sequelize.INTEGER,
        //     allowNull: false,
        //     references: {
        //         model: {
        //             tableName: DB_TABLES.CONSENTS,
        //         },
        //         key: 'id'
        //     }
        // },
        doctor_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.DOCTORS,
                },
                key: 'id'
            }
        },
        patient_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.PATIENTS,
                },
                key: 'id'
            }
        },
        details: {
            type: Sequelize.JSON,
        },
        activated_on: {
            type: Sequelize.DATE,
        },
        renew_on: {
            type: Sequelize.DATE,
        },
        expired_on: {
            type: Sequelize.DATE,
            allowNull: false
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    name: this.name,
                    condition_id: this.condition_id,
                    consent_id: this.consent_id,
                    doctor_id: this.doctor_id,
                    patient_id: this.patient_id,
                    details: this.details,
                    activated_on: this.activated_on,
                    renew_on: this.renew_on,
                    expired_on: this.expired_on
                };
            }
        }
    }
);

// CarePlan.hasOne(Conditions, {
//     foreignKey: "condition_id",
//     targetKey: "id"
// });

// CarePlan.hasOne(Consents, {
//     foreignKey: "consent_id",
//     targetKey: "id"
// });

CarePlan.hasOne(Patients, {
    foreignKey: "id",
    targetKey: "patient_id"
});

CarePlan.hasOne(Doctors, {
    foreignKey: "id",
    targetKey: "doctor_id"
});

export default CarePlan;
