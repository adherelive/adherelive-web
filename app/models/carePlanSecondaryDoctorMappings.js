"use strict";

import { DataTypes } from "sequelize";
import { TABLE_NAME as userRoleTableName } from "./userRoles";
import { TABLE_NAME as carePlanTableName } from "./carePlan";

export const TABLE_NAME = "careplan_secondary_doctor_mappings";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      care_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: carePlanTableName,
          },
          key: "id",
        },
      },
      secondary_doctor_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userRoleTableName,
          },
          key: "id",
        },
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            care_plan_id: this.care_plan_id,
            secondary_doctor_role_id: this.secondary_doctor_role_id,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const { careplan_secondary_doctor_mappings, care_plans, user_roles } =
    database.models || {};

  // associations here (if any) ...
  careplan_secondary_doctor_mappings.belongsTo(care_plans, {
    foreignKey: "care_plan_id",
    targetKey: "id",
  });

  careplan_secondary_doctor_mappings.belongsTo(user_roles, {
    foreignKey: "secondary_doctor_role_id",
    targetKey: "id",
  });
};
