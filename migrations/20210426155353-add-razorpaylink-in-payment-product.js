"use strict";

import { TABLE_NAME } from "../app/models/paymentProducts";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.addColumn(TABLE_NAME, "razorpay_link", {
      type: Sequelize.STRING,
      allowNull: true,
      defaultValue: null
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.removeColumn(TABLE_NAME, "razorpay_link");
  }
};
