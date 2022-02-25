"use strict";

import { GENDER, BLANK_STATE } from "../constant";
import { TABLE_NAME } from "../app/models/doctors";
import { TABLE_NAME as userTableName } from "../app/models/users";
import { TABLE_NAME as specialityTableName } from "../app/models/specialities";
import { DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userTableName,
          },
          key: "id",
        },
      },
      city: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      speciality_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: specialityTableName,
          },
          key: "id",
        },
      },
      gender: {
        type: Sequelize.ENUM,
        values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER, BLANK_STATE],
        allowNull: true,
      },
      profile_pic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      first_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      middle_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      activated_on: {
        type: Sequelize.DATE,
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
      signature_pic: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable(TABLE_NAME);
  },
};
