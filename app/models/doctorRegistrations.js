"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY, SIGN_IN_CATEGORY, GENDER} from "../../constant";
import Doctors from "./doctors";

const DoctorRegistrations = database.define(
    DB_TABLES.DOCTOR_REGISTRATIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
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
        number: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        registration_council_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.REGISTRATION_COUNCIL,
                },
                key: 'id'
            }
        },
        year: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        expiry_date: {
            type: Sequelize.DATE,
            allowNull: false
        }
    },
    {
        underscored: true,
        paranoid: true,
    }
);

DoctorRegistrations.belongsTo(Doctors, {
    foreignKey:"doctor_id",
    targetKey:"id"
});

export default DoctorRegistrations;
