"use strict";

import { TABLE_NAME } from "../app/models/serviceOffering";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "payment_link", {
        type: Sequelize.STRING(1000),
        allowNull: true,
      }),
      // queryInterface.changeColumn(TABLE_NAME, "type",{
      //   type: Sequelize.ENUM,
      //   values: [MEDICINE_TYPE.TABLET, MEDICINE_TYPE.INJECTION, MEDICINE_TYPE.SYRUP],
      //   defaultValue: MEDICINE_TYPE.TABLET
      // })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.removeColumn(TABLE_NAME, "payment_link"),
    ]);
  },
};
