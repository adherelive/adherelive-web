"use strict";

import {USER_CATEGORY} from "../../constant";
import {TABLE_NAME} from "../models/foodItems";

module.exports = {
  up: (queryInterface) => {
    return queryInterface.bulkInsert(TABLE_NAME, [
      {
        name: "Apple",
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Banana",
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Mango",
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Watermelon",
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Papaya",
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
      {
        name: "Guava",
        creator_type: USER_CATEGORY.ADMIN,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  
  down: (queryInterface) => {
    return queryInterface.bulkDelete(TABLE_NAME, null, {});
  },
};
