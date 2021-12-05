"use strict";
import {DataTypes} from "sequelize";
import * as ActionDetails from "./actionDetails";

export const TABLE_NAME = "adherence";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      action_details_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: ActionDetails.TABLE_NAME,
          },
          key: 'id'
        }
      },
      adherence: {
        type: DataTypes.STRING(1)
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  const {adherence, action_details} = database.models || {};
  
  // associations here (if any) ...
  adherence.belongsTo(action_details, {
    foreignKey: "action_details_id",
    targetKey: "id"
  });
};