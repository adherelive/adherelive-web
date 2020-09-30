"use strict";
import {DataTypes} from "sequelize";
import {EVENT_TYPE, EVENT_STATUS} from "../../constant";

export const SCHEDULE_EVENTS = "schedule_events";

export const db = (database) => {
    database.define(
        SCHEDULE_EVENTS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            critical: {
                type: DataTypes.BOOLEAN,
            },
            event_type: {
                type: DataTypes.ENUM,
                values: [EVENT_TYPE.APPOINTMENT, EVENT_TYPE.REMINDER, EVENT_TYPE.MEDICATION_REMINDER, EVENT_TYPE.VITALS]
            },
            event_id: {
                type: DataTypes.INTEGER,
            },
            details: {
                type: DataTypes.JSON,
            },
            status: {
                type: DataTypes.ENUM,
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
                type: DataTypes.DATEONLY,
            },
            start_time: {
                type: DataTypes.DATE,
            },
            end_time: {
                type: DataTypes.DATE,
            },
            created_at: {
                type: DataTypes.DATE,
            },
            updated_at: {
                type: DataTypes.DATE,
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {<TABLE_NAME>} = database.models || {};

    // associations here (if any) ...
};
