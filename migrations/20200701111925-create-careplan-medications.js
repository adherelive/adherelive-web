'use strict';

import {CARE_PLAN_MEDICATIONS} from "../app/models/carePlanMedications";
import  {CARE_PLANS} from "../app/models/carePlan";
import {MEDICATIONS} from "../app/models/medicationReminders";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(CARE_PLAN_MEDICATIONS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      care_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: CARE_PLANS,
          },
          key: 'id'
        }
      },
      medication_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: MEDICATIONS,
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
    return queryInterface.dropTable(CARE_PLAN_MEDICATIONS);
  }
};
