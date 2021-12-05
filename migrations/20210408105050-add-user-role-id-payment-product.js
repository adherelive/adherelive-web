"use strict";

import {TABLE_NAME} from "../app/models/paymentProducts";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn(
        TABLE_NAME,
        "for_user_id",
        "for_user_role_id"
      ),
      queryInterface.renameColumn(TABLE_NAME, "creator_id", "creator_role_id"),
    ]);
  },
  
  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.renameColumn(
        TABLE_NAME,
        "for_user_role_id",
        "for_user_id"
      ),
      queryInterface.renameColumn(TABLE_NAME, "creator_role_id", "creator_id"),
    ]);
  },
};
