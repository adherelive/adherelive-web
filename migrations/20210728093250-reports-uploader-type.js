"use strict";
import { TABLE_NAME } from "../app/models/reports";
import { USER_CATEGORY } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "uploader_type", {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.HSP
        ],
        allowNull: false
      })
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "uploader_type")
    ]);
  }
};
