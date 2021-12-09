"use strict";
import { DataTypes } from "sequelize";
import { USER_CATEGORY } from "../../constant";

export const REMINDERS = "reminders";

export const db = (database) => {
  database.define(
    REMINDERS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      participant_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      organizer_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.CARE_TAKER,
          USER_CATEGORY.HSP,
          USER_CATEGORY.PATIENT,
        ],
      },
      organizer_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING(1000),
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
      },
      rr_rule: {
        type: DataTypes.STRING(1000),
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
            rr_rule: this.rr_rule,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // const {TABLE_NAME} = database.models || {};
  // associations here (if any) ...
};
