"use strict";

import {TABLE_NAME} from "../app/models/userCategoryPermissions";
import {USER_CATEGORY} from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(TABLE_NAME, "category", {
      type: Sequelize.ENUM,
      values: [
        USER_CATEGORY.DOCTOR,
        USER_CATEGORY.PATIENT,
        USER_CATEGORY.CARE_TAKER,
        USER_CATEGORY.HSP,
        USER_CATEGORY.PROVIDER,
        USER_CATEGORY.ADMIN,
      ],
    });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.changeColumn(TABLE_NAME, "category", {
      type: Sequelize.ENUM,
      values: [
        USER_CATEGORY.DOCTOR,
        USER_CATEGORY.PATIENT,
        USER_CATEGORY.CARE_TAKER,
        USER_CATEGORY.HSP,
        USER_CATEGORY.PROVIDER,
        USER_CATEGORY.ADMIN,
      ],
    });
  },
};
