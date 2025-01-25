"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as exerciseDetailsTableName } from "./exerciseDetails";

export const TABLE_NAME = "repetitions";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      type: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // database.models[TABLE_NAME].belongsTo(database.models[exerciseDetailsTableName], {
  //   foreignKey:"repetition_id",
  //   targetKey: "id",
  // });
};
