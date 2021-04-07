"use strict";
import { DataTypes } from "sequelize";
import { EVENT_TYPE, EVENT_STATUS } from "../../constant";
import Logger from "../../libs/log";

import {TABLE_NAME as eventHistoryTableName} from "./eventHistory";

export const TABLE_NAME = "schedule_events";

const Log = new Logger("SCHEDULE_EVENTS > MODEL");

export const db = database => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      critical: {
        type: DataTypes.BOOLEAN
      },
      event_type: {
        type: DataTypes.ENUM,
        values: [
          EVENT_TYPE.APPOINTMENT,
          EVENT_TYPE.REMINDER,
          EVENT_TYPE.MEDICATION_REMINDER,
          EVENT_TYPE.VITALS,
          EVENT_TYPE.CARE_PLAN_ACTIVATION
        ]
      },
      event_id: {
        type: DataTypes.INTEGER
      },
      details: {
        type: DataTypes.JSON
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
        type: DataTypes.DATEONLY
      },
      start_time: {
        type: DataTypes.DATE
      },
      end_time: {
        type: DataTypes.DATE
      },
      created_at: {
        type: DataTypes.DATE
      },
      updated_at: {
        type: DataTypes.DATE
      }
    },
    {
      underscored: true,
      paranoid: true,
        hooks: {
          beforeUpdate: (instance, options) => {
              const {_previousDataValues : previousValues} = instance || {};
              const {id, event_type, details, critical, event_id} = previousValues || {};
              Log.info(`BEFORE_UPDATE : for event : ${event_type}`);

              // will accept update changes from all event types

              // if(event_type === EVENT_TYPE.VITALS) {
                return database.models[eventHistoryTableName].create({
                    schedule_event_id:id,
                   data: previousValues
                });
              // }
          }
        }
    }
  );
};

export const associate = database => {
  // const {<TABLE_NAME>} = database.models || {};
  // associations here (if any) ...
};
