'use strict';

import { DB_TABLES } from "../constant";
import {TEMPLATE_MEDICATIONS} from "../app/models/templateMedications";
import {MEDICINES} from "../app/models/medicines";
import {CARE_PLAN_TEMPLATES} from "../app/models/careplanTemplate";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TEMPLATE_MEDICATIONS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      care_plan_template_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: CARE_PLAN_TEMPLATES,
          },
          key: 'id'
        }
      },
      medicine_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.MEDICINES,
          },
          key: 'id'
        }
      },
      schedule_data: {
        type: Sequelize.JSON,
        allowNull: true
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
    return queryInterface.dropTable(DB_TABLES.TEMPLATE_MEDICATIONS);
  }
};
