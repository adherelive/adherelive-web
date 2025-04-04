"use strict";

import { DataTypes } from "sequelize";
import { TABLE_NAME } from "../app/models/consents";
import { TABLE_NAME as doctorTableName } from "../app/models/doctors";
import { TABLE_NAME as patientTableName } from "../app/models/patients";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      type: {
        type: Sequelize.STRING,
        allowNull: false,
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
      details: {
        type: Sequelize.JSON,
      },
      activated_on: {
        type: Sequelize.DATE,
      },
      expired_on: {
        type: Sequelize.DATE,
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
