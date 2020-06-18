'use strict';

import {DB_TABLES, GENDER} from "../constant";
import Sequelize from "sequelize";

module.exports = {
  up: (queryInterface, Sequelize) => {
      return queryInterface.createTable(DB_TABLES.PATIENTS, {
          id: {
              allowNull: false,
              autoIncrement: true,
              primaryKey: true,
              type: Sequelize.INTEGER
          },
          user_id: {
              type: Sequelize.INTEGER,
              allowNull: false,
              references: {
                  model: {
                      tableName: DB_TABLES.USERS,
                  },
                  key: 'id'
              }
          },
          gender: {
              type: Sequelize.ENUM,
              values: [GENDER.MALE, GENDER.FEMALE, GENDER.TRANS],
              allowNull: true
          },
          first_name: {
              type: Sequelize.STRING(100),
              allowNull: false,
          },
          middle_name: {
              type: Sequelize.STRING(100),
              allowNull: true,
          },
          last_name: {
              type: Sequelize.STRING(100),
              allowNull: false,
          },
          age: {
            type: Sequelize.STRING,
          },
          address: {
              type: Sequelize.STRING,
          },
          activated_on: {
              type: Sequelize.DATE
          },
          uid: {
             type: Sequelize.STRING,
             allowNull: false
          },
          details: {
              type: Sequelize.JSON,
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
      return queryInterface.dropTable(DB_TABLES.PATIENTS);
  }
};
