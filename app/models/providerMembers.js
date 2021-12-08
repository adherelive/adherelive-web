"use strict";
import { DataTypes } from "sequelize";
import { PROVIDERS } from "./providers";

import { USER_CATEGORY } from "../../constant";

export const PROVIDER_MEMBERS = "provider_members";

export const db = (database) => {
  database.define(
    PROVIDER_MEMBERS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: PROVIDERS,
          },
          key: "id",
        },
      },
      member_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.HSP,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
        allowNull: false,
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
            provider_id: this.provider_id,
            member_type: this.member_type,
            member_id: this.member_id,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const { providers, provider_members } = database.models || {};

  // associations here (if any) ...
  provider_members.belongsTo(providers, {
    foreignKey: "provider_id",
    targetKey: "id",
  });
};
