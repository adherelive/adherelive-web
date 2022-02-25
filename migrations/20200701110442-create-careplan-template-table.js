"use strict";

import { DB_TABLES } from "../constant";
import { TABLE_NAME } from "../app/models/careplanTemplate";
import { TABLE_NAME as treatmentTableName } from "../app/models/treatments";
import { TABLE_NAME as severityTableName } from "../app/models/severity";
import { TABLE_NAME as conditionTableName } from "../app/models/conditions";
import { TABLE_NAME as userTableName } from "../app/models/users";
import { TABLE_NAME as doctorTableName } from "../app/models/doctors";
import { TABLE_NAME as providerTableName } from "../app/models/providers";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      treatment_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: treatmentTableName,
          },
          key: "id",
        },
      },
      severity_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: severityTableName,
          },
          key: "id",
        },
      },
      condition_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: conditionTableName,
          },
          key: "id",
        },
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: userTableName,
          },
          key: "id",
        },
      },
      details: {
        type: Sequelize.JSON,
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
      is_public_in_provider: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      is_public_global: {
        allowNull: false,
        type: Sequelize.BOOLEAN,
        defaultValue: false,
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: doctorTableName,
          },
          key: "id",
        },
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: providerTableName,
          },
          key: "id",
        },
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
