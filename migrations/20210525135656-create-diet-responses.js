"use strict";

import { TABLE_NAME } from "../app/models/dietResponses";
import { TABLE_NAME as dietTableName } from "../app/models/diet";
import { TABLE_NAME as scheduleEventsTable } from "../app/models/scheduleEvents";

import { DIET_RESPONSE_STATUS } from "../constant";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(TABLE_NAME, {
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
      created_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE,
      },
      deleted_at: {
        type: DataTypes.DATE,
      },
    });
  },

  down: (queryInterface, DataTypes) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
