'use strict';

import {VERIFICATION_TYPE} from "../constant";
import {TABLE_NAME} from "../app/models/userVerifications";
import {TABLE_NAME as userTableName} from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
   return queryInterface.createTable(TABLE_NAME, {
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
          tableName: userTableName,
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
  return queryInterface.dropTable(TABLE_NAME);
}
};
