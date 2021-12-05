"use strict";
import {DataTypes} from "sequelize";
import {REGIONS} from "./regions";
import {PROVIDERS} from "./providers";

export const REGION_PROVIDERS = "region_providers";

export const db = (database) => {
  database.define(
    REGION_PROVIDERS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      region_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: REGIONS,
          },
          key: "id",
        },
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
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            region_id: this.region_id,
            provider_id: this.provider_id,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const {region_providers, regions, providers} = database.models || {};
  
  // associations here (if any) ...
  region_providers.hasOne(regions, {
    foreignKey: "region_id",
    targetKey: "id",
  });
  
  // region_providers.hasOne(providers, {
  //     foreignKey: "provider_id",
  //     targetKey: "id"
  // });
};
