"use strict";

import { TABLE_NAME } from "../app/models/paymentProducts";
import { USER_CATEGORY_ARRAY } from "../app/models/users";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "for_user_id", {
        type: Sequelize.INTEGER,
        allowNull: false
      }),
      queryInterface.addColumn(TABLE_NAME, "for_user_type", {
        type: Sequelize.ENUM,
        values: USER_CATEGORY_ARRAY
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "for_user_id"),
      queryInterface.removeColumn(TABLE_NAME, "for_user_type")
    ]);
  }
};
