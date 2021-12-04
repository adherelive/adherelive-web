"use strict";

import {TABLE_NAME} from "../app/models/features";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.addColumn(
          TABLE_NAME,
          "details",
          {
            type: Sequelize.JSON,
            allowNull: true,
          },
          {transaction: t}
        ),
        queryInterface.removeColumn(TABLE_NAME, "description", {
          transaction: t,
        }),
      ]);
    });
  },
  
  down: (queryInterface, Sequelize) => {
    return queryInterface.sequelize.transaction((t) => {
      return Promise.all([
        queryInterface.removeColumn(TABLE_NAME, "details", {transaction: t}),
        queryInterface.addColumn(
          TABLE_NAME,
          "description",
          {
            type: Sequelize.STRING(1000),
          },
          {transaction: t}
        ),
      ]);
    });
  },
};
