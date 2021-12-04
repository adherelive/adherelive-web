"use strict";

import {DB_TABLES} from "../constant";
import {TABLE_NAME} from "../app/models/carePlan";
import {TABLE_NAME as doctorTableName} from "../app/models/doctors";
import {TABLE_NAME as patientTableName} from "../app/models/patients";
import {TABLE_NAME as carePlanTemplateName} from "../app/models/careplanTemplate";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
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
      care_plan_template_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: carePlanTemplateName,
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
      renew_on: {
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
