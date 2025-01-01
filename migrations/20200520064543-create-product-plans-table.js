"use strict";

import { CURRENCY, DB_TABLES, REPEAT_TYPE, USER_CATEGORY } from "../constant";

module.exports = {
  up: (queryInterface, Sequelize) => {
    /*
                  Add altering commands here.
                  Return a promise to correctly handle asynchronicity.

                  Example:
                  return queryInterface.createTable('users', { id: Sequelize.INTEGER });
                */
    return queryInterface.createTable(DB_TABLES.PRODUCT_PLANS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      provider_type: {
        type: Sequelize.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.HSP,
        ],
      },
      provider_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
      subscription_charge: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      currency: {
        type: Sequelize.ENUM,
        values: [CURRENCY.INR, CURRENCY.AUD, CURRENCY.USD],
        allowNull: false,
      },
      billing_cycle: {
        type: Sequelize.ENUM,
        values: [
          REPEAT_TYPE.YEARLY,
          REPEAT_TYPE.MONTHLY,
          REPEAT_TYPE.WEEKLY,
          REPEAT_TYPE.DAILY,
        ],
        allowNull: false,
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    /*
                                  Add reverting commands here.
                                  Return a promise to correctly handle asynchronicity.

                                  Example:
                                  return queryInterface.dropTable('users');
                    */
    return queryInterface.dropTable(DB_TABLES.PRODUCT_PLANS);
  },
};
