"use strict";
import { DataTypes } from "sequelize";
import { USER_CATEGORY } from "../../constant";

export const TABLE_NAME = "appointments";

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
      participant_one_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.HSP,
        ],
      },
      participant_one_id: {
        type: DataTypes.INTEGER,
      },
      participant_two_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.HSP,
        ],
      },
      participant_two_id: {
        type: DataTypes.INTEGER,
      },
      organizer_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.HSP,
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.CARE_TAKER,
        ],
      },
      organizer_id: {
        type: DataTypes.INTEGER,
      },
      provider_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      provider_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      description: {
        type: DataTypes.STRING(1000),
      },
      start_date: {
        type: DataTypes.DATEONLY,
      },
      end_date: {
        type: DataTypes.DATEONLY,
      },
      start_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      end_time: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      rr_rule: {
        type: DataTypes.STRING(1000),
      },
      details: {
        type: DataTypes.JSON,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            participant_one_type: this.participant_one_type,
            participant_one_id: this.participant_one_id,
            participant_two_type: this.participant_two_type,
            participant_two_id: this.participant_two_id,
            organizer_type: this.organizer_type,
            organizer_id: this.organizer_id,
            description: this.description,
            start_date: this.start_date,
            end_date: this.end_date,
            rr_rule: this.rr_rule,
            start_time: this.start_time,
            end_time: this.end_time,
            details: this.details,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // const {<TABLE_NAME>} = database.models || {};
  // associations here (if any) ...
};
