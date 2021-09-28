"use strict";

import { TABLE_NAME } from "../app/models/exerciseRepetition";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      type: {
        type: DataTypes.STRING(1000),
        allowNull: false
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        type: DataTypes.DATE
      }
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  }
};
