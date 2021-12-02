"use strict";

import { MEDICINE_TYPE } from "../constant";
import { TABLE_NAME } from "../app/models/medicines";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      name: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      type: {
        type: Sequelize.STRING,
        // values: [MEDICINE_TYPE.TABLET, MEDICINE_TYPE.INJECTION],
        defaultValue: MEDICINE_TYPE.TABLET,
      },
      description: {
        type: Sequelize.STRING(1000),
      },
      details: {
        type: Sequelize.JSON,
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
