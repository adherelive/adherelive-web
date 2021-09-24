"use strict";

import { TABLE_NAME } from "../app/models/careplanSecondaryDoctorMappings";
import { TABLE_NAME as careplanTableName } from "../app/models/carePlan";
import { TABLE_NAME as userRoleTableName } from "../app/models/userRoles";

module.exports = {
  up: (queryInterface, DataTypes) => {
    return queryInterface.createTable(TABLE_NAME, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      care_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: careplanTableName
          },
          key: "id"
        }
      },
      secondary_doctor_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userRoleTableName
          },
          key: "id"
        }
      },
      created_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      },
      deleted_at: {
        allowNull: true,
        type: DataTypes.DATE
      }
    });
  },

  down: queryInterface => {
    return queryInterface.dropTable(TABLE_NAME);
  }
};
