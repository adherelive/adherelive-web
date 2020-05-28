"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY, SIGN_IN_CATEGORY, GENDER} from "../../constant";
import Users from "./users";

const Doctors = database.define(
    DB_TABLES.DOCTORS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.USERS,
                },
                key: 'id'
            }
        },
        registration_number: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        registration_start_date: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        registration_expiry_date: {
            type: Sequelize.DATE,
            allowNull: true,
        },
        gender: {
            type: Sequelize.ENUM,
            values: [GENDER.MALE, GENDER.FEMALE, GENDER.TRANS],
            allowNull: true
        },
        first_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        middle_name: {
            type: Sequelize.STRING(100),
            allowNull: true,
        },
        last_name: {
            type: Sequelize.STRING(100),
            allowNull: false,
        },
        address: {
            type: Sequelize.STRING,
            allowNull: false
        },
        qualifications: {
            type: Sequelize.JSON,
        },
        activated_on: {
            type: Sequelize.DATE
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    user_id: this.user_id,
                    gender: this.gender,
                    first_name: this.first_name,
                    middle_name: this.middle_name,
                    last_name: this.last_name,
                    address: this.address,
                    qualifications: this.qualifications,
                    activated_on: this.activated_on
                };
            }
        }
    }
);

Doctors.belongsTo(Users, {
   foreignKey:"user_id",
    targetKey:"id"
});

export default Doctors;
