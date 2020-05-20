"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import Consents from "./consents";

const Clinics = database.define(
    DB_TABLES.CLINICS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        consent_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.CONSENTS,
                },
                key: 'id'
            }
        },
        activated_on: {
            type: Sequelize.DATE
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
                    consent_id: this.consent_id,
                    activated_on: this.activated_on,
                    expired_on: this.expired_on
                };
            }
        }
    }
);

Clinics.hasOne(Consents, {
    foreignKey: "consent_id",
    targetKey: "id"
});

export default Clinics;
