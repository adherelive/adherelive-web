"use strict";
import { DataTypes } from "sequelize";
import { FEATURES } from "./features";

export const REGION_FEATURES = "region_features";

export const db = (database) => {
  database.define(
    REGION_FEATURES,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      feature_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: FEATURES,
          },
          key: "id",
        },
      },
      activated_on: {
        type: DataTypes.DATE,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            name: this.name,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const { region_features, features } = database.models || {};

  // associations here (if any) ...
  region_features.belongsTo(features, {
    foreignKey: "feature_id",
    targetKey: "id",
  });
};
