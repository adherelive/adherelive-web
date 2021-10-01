"use strict";
import { DataTypes } from "sequelize";
import moment from "moment";
import { TABLE_NAME as carePlanTemplateTableName } from "./careplanTemplate";

export const TABLE_NAME = "template_workouts";

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
      care_plan_template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: carePlanTemplateTableName,
          },
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_calories: {
        type: DataTypes.FLOAT(11, 2),
      },
      duration: {
        type: DataTypes.INTEGER,
      },
      time: {
        type: DataTypes.DATE,
        set(value) {
          if (value) {
            this.setDataValue(
              "time",
              moment(value)
                .seconds(0)
                .toISOString()
            );
          } else {
            this.setDataValue("time", null);
          }
        }
      },
      details: {
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
