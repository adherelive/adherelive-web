"use strict";
export const TABLE_NAME = "his_provider_tables";
import { DataTypes } from "sequelize";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      his_username: {
        type: DataTypes.STRING(100),
        // unique: true,
        allowNull: false,
        required: true,
      },
      his_password: {
        type: DataTypes.STRING(1000),
        allow_null: false,
        required: true,
      },
      his_client_id: {
        type: DataTypes.STRING,
        allowNull: false,
        required: true,
      },
      his_client_secret: {
        type: DataTypes.STRING(1000),
        // unique: true,
        allow_null: false,
        required: true,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            his_id: this.id,
            his_username: this.his_username,
            his_password: this.his_password,
            his_client_id: this.his_client_id,
            his_client_secret: this.his_client_secret,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // database.models || {};
};
