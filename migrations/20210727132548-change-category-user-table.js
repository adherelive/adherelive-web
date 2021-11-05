"use strict";
import { TABLE_NAME } from "../app/models/users";
import { USER_CATEGORY } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return Promise.all([
      queryInterface.changeColumn(TABLE_NAME, "category", {
        allowNull: false,
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.PATIENT,
          USER_CATEGORY.CARE_TAKER,
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
          USER_CATEGORY.HSP,
        ],
      }),
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return Promise.all([queryInterface.changeColumn(TABLE_NAME, "category")]);
  },
};
