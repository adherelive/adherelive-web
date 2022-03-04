"use strict";
import { DataTypes } from "sequelize";

export const PATIENT_CARE_TAKERS = "patient_care_takers";

export const db = (database) => {
  database.define(
    PATIENT_CARE_TAKERS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      care_taker_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      consent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            patient_id: this.patient_id,
            care_taker_id: this.care_taker_id,
            consent_id: this.consent_id,
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
