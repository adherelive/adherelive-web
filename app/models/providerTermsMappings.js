"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as providerTableName } from "./providers";
import { TABLE_NAME as termsAndConditions } from "./termsAndConditions";

export const TABLE_NAME = "provider_terms_mappings";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      provider_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: providerTableName,
          },
          key: "id",
        },
      },
      terms_and_conditions_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: termsAndConditions,
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
            provider_id: this.provider_id,
            terms_and_conditions_id: this.terms_and_conditions_id,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  database.models[TABLE_NAME].belongsTo(database.models[providerTableName], {
    foreignKey: "provider_id",
    targetKey: "id",
  });
};
