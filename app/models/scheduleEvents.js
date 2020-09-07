"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, EVENT_TYPE, EVENT_STATUS} from "../../constant";

const ScheduleEvent = database.define(
    DB_TABLES.SCHEDULE_EVENTS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        critical: {
            type: Sequelize.BOOLEAN,
        },
        event_type: {
            type: Sequelize.ENUM,
            values: [EVENT_TYPE.APPOINTMENT, EVENT_TYPE.REMINDER, EVENT_TYPE.MEDICATION_REMINDER, EVENT_TYPE.VITALS]
        },
        event_id: {
            type: Sequelize.INTEGER,
        },
        details: {
            type: Sequelize.JSON,
        },
        status: {
            type: Sequelize.ENUM,
            values: [
                EVENT_STATUS.SCHEDULED,
                EVENT_STATUS.PENDING,
                EVENT_STATUS.COMPLETED,
                EVENT_STATUS.EXPIRED,
                EVENT_STATUS.CANCELLED
            ],
            defaultValue: EVENT_STATUS.PENDING
        },
        date: {
          type: Sequelize.DATEONLY,
        },
        start_time: {
            type: Sequelize.DATE,
        },
        end_time: {
            type: Sequelize.DATE,
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    event_type: this.event_type,
                    event_id: this.event_id,
                    details: this.details,
                    status: this.status,
                    start_time: this.start_time,
                    end_time: this.end_time,
                };
            }
        }
    }
);

export default ScheduleEvent;
