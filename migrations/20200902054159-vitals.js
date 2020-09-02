'use strict';

import {VITALS} from "../app/models/vitals";
import {VITAL_TEMPLATES} from "../app/models/vitalTemplates";
import {CARE_PLANS} from "../app/models/carePlan";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(VITALS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      vital_template_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: VITAL_TEMPLATES,
          },
          key: 'id'
        }
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
      details: {
        type: Sequelize.JSON
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
    return queryInterface.dropTable(VITALS);
  }
};
