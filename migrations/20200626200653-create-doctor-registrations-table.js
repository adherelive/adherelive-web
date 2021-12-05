"use strict";

import {TABLE_NAME} from "../app/models/doctorRegistrations";
import {TABLE_NAME as doctorTableName} from "../app/models/doctors";
import {TABLE_NAME as registrationCouncilTableName} from "../app/models/registrationCouncil";

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
      number: {
        type: Sequelize.STRING(100),
        allowNull: false,
      },
      registration_council_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: registrationCouncilTableName,
          },
          key: "id",
        },
      },
      year: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      expiry_date: {
        type: Sequelize.DATE,
        allowNull: false,
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
