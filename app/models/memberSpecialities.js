"use strict";
import { DataTypes } from "sequelize";
import { SPECIALITIES } from "./specialities";

import { USER_CATEGORY } from "../../constant";

export const MEMBER_SPECIALITIES = "member_specialities";

export const db = (database) => {
  database.define(
    MEMBER_SPECIALITIES,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      speciality_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: SPECIALITIES,
          },
          key: "id",
        },
      },
      member_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.HSP,
        ],
      },
      member_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            speciality_id: this.speciality_id,
            member_type: this.member_type,
            member_id: this.member_id,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const { member_specialities, specialities } = database.models || {};

  // associations here (if any) ...
  member_specialities.belongsTo(specialities, {
    foreignKey: "speciality_id",
    targetKey: "id",
  });
};
