"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as patientTableName} from "./patients";
import {TABLE_NAME as providerTermsMapping} from "./providerTermsMappings";
import {TABLE_NAME as doctorTableName} from "./doctors";

export const TABLE_NAME = "patient_payment_consent_mappings";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: doctorTableName,
          },
          key: "id",
        },
      },
      provider_terms_mapping_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: providerTermsMapping,
          },
          key: "id",
        },
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: patientTableName,
          },
          key: "id",
        },
      },
      payment_terms_accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
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
            provider_terms_mapping_id: this.provider_terms_mapping_id,
            payment_terms_accepted: this.payment_terms_accepted,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
};
