'use strict';

import {DB_TABLES} from "../constant";
import {TREATMENT_CONDITION_MAPPING} from "../app/models/treatmentConditionMapping";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TREATMENT_CONDITION_MAPPING, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      condition_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.CONDITIONS,
          },
          key: 'id'
        }
      },
      treatment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.TREATMENTS,
          },
          key: 'id'
        }
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
    return queryInterface.dropTable(TREATMENT_CONDITION_MAPPING);
  }
};
