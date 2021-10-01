import { DataTypes } from "sequelize";
import Database from "../../libs/mysql";

import { TABLE_NAME as scheduleEventTableName } from "./scheduleEvents";

export const TABLE_NAME = "event_history";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      schedule_event_id: {
        type: DataTypes.INTEGER,
                allowNull: false,
      },
      data: {
        type: DataTypes.JSON
            },
    },
    {
      underscored: true,
      paranoid: true,
      freezeTableName: true
    }
  );
};

export const associate = (database) => {
    database.models[TABLE_NAME].belongsTo(database.models[scheduleEventTableName], {
      foreignKey: "schedule_event_id",
      targetKey: "id"
    });
};
