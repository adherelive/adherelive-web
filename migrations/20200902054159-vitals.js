"use strict";

import {TABLE_NAME} from "../app/models/vitals";
import {TABLE_NAME as vitalTemplateTableName} from "../app/models/vitalTemplates";
import {TABLE_NAME as carePlanTableName} from "../app/models/carePlan";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      vital_template_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: vitalTemplateTableName,
          },
          key: "id",
        },
      },
      care_plan_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: carePlanTableName,
          },
          key: "id",
        },
      },
      details: {
        type: Sequelize.JSON,
      },
      description: {
        type: Sequelize.STRING(1000),
      },
      start_date: {
        type: Sequelize.DATE,
      },
      end_date: {
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
