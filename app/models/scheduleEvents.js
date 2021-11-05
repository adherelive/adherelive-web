"use strict";
import moment from "moment";
import { DataTypes } from "sequelize";
import { EVENT_TYPE, EVENT_STATUS } from "../../constant";
import Logger from "../../libs/log";

import { TABLE_NAME as eventHistoryTableName } from "./eventHistory";

export const TABLE_NAME = "schedule_events";

const Log = new Logger("SCHEDULE_EVENTS > MODEL");

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      critical: {
        type: DataTypes.BOOLEAN,
      },
      event_type: {
        type: DataTypes.ENUM,
        values: [
          EVENT_TYPE.APPOINTMENT,
          EVENT_TYPE.REMINDER,
          EVENT_TYPE.MEDICATION_REMINDER,
          EVENT_TYPE.VITALS,
          EVENT_TYPE.CARE_PLAN_ACTIVATION,
          EVENT_TYPE.DIET,
          EVENT_TYPE.WORKOUT,
        ],
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
          EVENT_STATUS.CANCELLED,
        ],
        defaultValue: EVENT_STATUS.PENDING,
      },
      date: {
        type: DataTypes.DATEONLY,
      },
      start_time: {
        type: DataTypes.DATE,
        set(val) {
          this.setDataValue("start_time", moment(val).seconds(0).toISOString());
        },
      },
      end_time: {
        type: DataTypes.DATE,
        set(val) {
          this.setDataValue("end_time", moment(val).seconds(0).toISOString());
        },
      },
      created_at: {
        type: DataTypes.DATE,
      },
      updated_at: {
        type: DataTypes.DATE,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      paranoid: true,
      hooks: {
        beforeUpdate: (instance, options) => {
          const { _previousDataValues: previousValues } = instance || {};
          const { id, event_type, details, critical, event_id } =
            previousValues || {};
          Log.info(`BEFORE_UPDATE : for event : ${event_type}`);

          // will accept update changes from all event types

          // if(event_type === EVENT_TYPE.VITALS) {
          return database.models[eventHistoryTableName].create({
            schedule_event_id: id,
            data: previousValues,
          });
          // }
        },
      },
    }
  );
};

export const associate = (database) => {
  // const {<TABLE_NAME>} = database.models || {};
  // associations here (if any) ...
};
