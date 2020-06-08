"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY, SIGN_IN_CATEGORY, GENDER} from "../../constant";
import Users from "./users";

const Appointments = database.define(
    DB_TABLES.APPOINTMENTS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        participant_one_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT]
        },
        participant_one_id: {
            type: Sequelize.INTEGER,
        },
        participant_two_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT]
        },
        participant_two_id: {
            type: Sequelize.INTEGER,
        },
        organizer_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.CARE_TAKER]
        },
        organizer_id: {
            type: Sequelize.INTEGER,
        },
        description: {
            type: Sequelize.STRING(1000)
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        },
        rr_rule: {
            type: Sequelize.STRING(1000)
        },
        details: {
            type: Sequelize.JSON,
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    participant_one_type: this.participant_one_type,
                    participant_one_id: this.participant_one_id,
                    participant_two_type: this.participant_two_type,
                    participant_two_id: this.participant_two_id,
                    organizer_type: this.organizer_type,
                    organizer_id: this.organizer_id,
                    description: this.description,
                    start_date: this.start_date,
                    end_date: this.end_date,
                    rr_rule: this.rr_rule,
                    details: this.details,
                };
            }
        }
    }
);

export default Appointments;
