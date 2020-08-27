'use strict';

import {DB_TABLES} from "../constant";
import Sequelize from "sequelize";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.SYMPTOMS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      patient_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.PATIENTS,
          },
          key: 'id'
        }
      },
      care_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: DB_TABLES.CARE_PLANS,
          },
          key: 'id'
        }
      },
      config: {
        type: Sequelize.JSON
      },
      text: {
        type: Sequelize.STRING(1000)
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(DB_TABLES.SYMPTOMS);
  }
};
