"use strict";
import { TABLE_NAME } from "../app/models/careplanTemplate";
import {DataTypes} from "sequelize";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "treatment_id", {
        type: DataTypes.INTEGER,
        allowNull: true
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "treatment_id"),
    ]);
  }
};
