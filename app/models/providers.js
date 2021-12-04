"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as userTableName} from "./users";

export const TABLE_NAME = "providers";

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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userTableName,
          },
          key: "id",
        },
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      address: {
        type: DataTypes.STRING,
      },
      city: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      state: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      activated_on: {
        type: DataTypes.DATE,
      },
      details: {
        type: DataTypes.JSON,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            user_id: this.user_id,
            name: this.name,
            address: this.address,
            city: this.city,
            state: this.state,
            activated_on: this.activated_on,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  database.models[TABLE_NAME].belongsTo(database.models[userTableName], {
    foreignKey: "user_id",
    targetKey: "id",
  });
};
