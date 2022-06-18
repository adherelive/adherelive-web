"use strict";

import { TABLE_NAME } from "../app/models/doctorClinics";
import { TABLE_NAME as doctorTableName } from "../app/models/doctors";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: doctorTableName
          },
          key: "id"
        }
      },
      name: {
        type: Sequelize.STRING(200),
        allowNull: false
      },
      location: {
        type: Sequelize.STRING(400),
        allowNull: false
      },
      details: {
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
    return queryInterface.dropTable(TABLE_NAME);
  }
};
