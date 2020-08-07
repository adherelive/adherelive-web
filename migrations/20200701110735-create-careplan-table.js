'use strict';

import {DB_TABLES} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
    return queryInterface.createTable(DB_TABLES.CARE_PLANS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      // name: {
      //   type: Sequelize.STRING(1000)
      // },
      // condition_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: {
      //       tableName: DB_TABLES.CONDITIONS,
      //     },
      //     key: 'id'
      //   }
      // },
      // consent_id: {
      //   type: Sequelize.INTEGER,
      //   allowNull: false,
      //   references: {
      //     model: {
      //       tableName: DB_TABLES.CONSENTS,
      //     },
      //     key: 'id'
      //   }
      // },
      doctor_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: DB_TABLES.DOCTORS,
          },
          key: 'id'
        }
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
      care_plan_template_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: DB_TABLES.CARE_PLAN_TEMPLATE,
          },
          key: 'id'
        }
      },
      details: {
        type: Sequelize.JSON,
      },
      activated_on: {
        type: Sequelize.DATE,
      },
      renew_on: {
        type: Sequelize.DATE,
      },
      expired_on: {
        type: Sequelize.DATE,
        allowNull: false
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
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.dropTable('users');
    */
    return queryInterface.dropTable(DB_TABLES.CARE_PLANS);
  }
};
