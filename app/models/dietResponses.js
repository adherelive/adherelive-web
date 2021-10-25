"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as dietTableName } from "./diet";
import { TABLE_NAME as scheduleEventsTable } from "./scheduleEvents";

import { DIET_RESPONSE_STATUS } from "../../constant";

export const TABLE_NAME = "diet_responses";

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
      diet_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: dietTableName,
          },
          key: "id",
        },
      },
      schedule_event_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: scheduleEventsTable,
          },
          key: "id",
        },
      },
      status: {
        type: DataTypes.ENUM,
        allowNull: false,
        values: [
          DIET_RESPONSE_STATUS.DONE,
          DIET_RESPONSE_STATUS.EXPIRED,
          DIET_RESPONSE_STATUS.PARTIALLY_DONE,
          DIET_RESPONSE_STATUS.SKIPPED,
        ],
      },
      document_uploaded: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      response_text: {
        type: DataTypes.STRING(2000),
      },
      other_details: {
        type: DataTypes.JSON,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {};
