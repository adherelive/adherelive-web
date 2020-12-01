'use strict';
import {USER_CATEGORY} from "../../constant";
import {TABLE_NAME} from "../models/userCategoryPermissions";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "4",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "5",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "6",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "7",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "8",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.DOCTOR,
        permission_id: "9",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.PATIENT,
        permission_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.PATIENT,
        permission_id: "2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.PATIENT,
        permission_id: "3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.PATIENT,
        permission_id: "4",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.PATIENT,
        permission_id: "5",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.PATIENT,
        permission_id: "6",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.PATIENT,
        permission_id: "7",
        created_at: new Date(),
        updated_at: new Date(),
      },
        // admin
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "1",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "2",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "3",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "4",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "5",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "6",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "7",
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        category:USER_CATEGORY.ADMIN,
        permission_id: "8",
        created_at: new Date(),
        updated_at: new Date(),
      },
      // provider
      {
        category:USER_CATEGORY.PROVIDER,
        permission_id: "10",
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
