'use strict';
import {DB_TABLES, USER_CATEGORY} from "../../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.bulkInsert(DB_TABLES.USER_CATEGORY_PERMISSIONS, [
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
      }
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(DB_TABLES.USER_CATEGORY_PERMISSIONS, null, {});
  }
};
