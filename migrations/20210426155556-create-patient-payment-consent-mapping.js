"use strict";
import {TABLE_NAME} from "../app/models/patientPaymentConsentMapping";
import {TABLE_NAME as providerTermsMapping} from "../app/models/providerTermsMappings";
import {TABLE_NAME as patientTableName} from "../app/models/patients";
import {TABLE_NAME as doctorTableName} from "../app/models/doctors";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: doctorTableName,
          },
          key: "id",
        },
      },
      provider_terms_mapping_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: providerTermsMapping,
          },
          key: "id",
        },
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: patientTableName,
          },
          key: "id",
        },
      },
      payment_terms_accepted: {
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
