"use strict";
import { DataTypes } from "sequelize";
import { USER_CATEGORY } from "../../constant";
// import { TABLE_NAME as exerciseTableName } from "./exercise";

export const TABLE_NAME = "exercise_user_created_mappings";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
        defaultValue: USER_CATEGORY.DOCTOR
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // database.models[TABLE_NAME].hasOne(database.models[exerciseTableName], {
  //   foreignKey:"exercise_id",
  //   targetKey: "id",
  // });
};
