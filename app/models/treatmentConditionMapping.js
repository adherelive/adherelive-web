"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as conditionTableName} from "./conditions";
import {TABLE_NAME as treatmentTableName} from "./treatments";

export const TABLE_NAME = "treatment_condition_mappings";

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
      condition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: conditionTableName,
          },
          key: "id",
        },
      },
      treatment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: treatmentTableName,
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
            name: this.name,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // const {TABLE_NAME} = database.models || {};
  // associations here (if any) ...
};
