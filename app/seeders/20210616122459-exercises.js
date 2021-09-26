'use strict';

import { USER_CATEGORY } from "../../constant";
import {TABLE_NAME} from "../models/exercise";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "Push Ups",
        creator_type:USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Pull Ups",
        creator_type:USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Plank",
        creator_type:USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Running",
        creator_type:USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        name: "Jogging",
        creator_type:USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date()
      },
    ]);
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  }
};
