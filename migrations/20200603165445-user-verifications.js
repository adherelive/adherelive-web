'use strict';

import {DB_TABLES, VERIFICATION_TYPE} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
      Add altering commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.createTable('users', { id: Sequelize.INTEGER });
    */
   return queryInterface.createTable(DB_TABLES.USER_VERIFICATIONS, {
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
    request_id: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    status: {
      type: Sequelize.STRING(20)
    },
       type: {
        type: Sequelize.ENUM,
           values: [VERIFICATION_TYPE.FORGOT_PASSWORD, VERIFICATION_TYPE.SIGN_UP, VERIFICATION_TYPE.PATIENT_SIGN_UP]
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
  return queryInterface.dropTable(DB_TABLES.USER_VERIFICATIONS);
}
};
