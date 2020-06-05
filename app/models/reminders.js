"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY} from "../../constant";

const Reminders = database.define(
    DB_TABLES.REMINDERS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        participant_id: {
            type: Sequelize.INTEGER,
            allowNull: false
        },
        organizer_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PATIENT, USER_CATEGORY.CARE_TAKER]
        },
        organizer_id: {
            type: Sequelize.INTEGER,
            allowNull: false
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
                    rr_rule: this.rr_rule
                };
            }
        }
    }
);

export default Reminders;
