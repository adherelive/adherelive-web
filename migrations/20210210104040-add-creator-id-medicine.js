"use strict";

import { TABLE_NAME } from "../app/models/medicines";
import { MEDICINE_TYPE } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.addColumn(TABLE_NAME, "creator_id", {
        type: Sequelize.INTEGER,
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
      queryInterface.removeColumn(TABLE_NAME, "creator_id"),
      // queryInterface.changeColumn(TABLE_NAME, "type",{
      //   type: Sequelize.ENUM,
      //   values: [MEDICINE_TYPE.TABLET, MEDICINE_TYPE.INJECTION],
      //   defaultValue: MEDICINE_TYPE.TABLET
      // })
    ]);
  },
};
