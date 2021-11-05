"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as exerciseDetailTableName } from "./exerciseDetails";
import { TABLE_NAME as workoutTemplateExerciseMappingTableName } from "./workoutTemplateExerciseMapping";
import { USER_CATEGORY } from "../../constant";

export const TABLE_NAME = "workout_templates";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      name: {
        type: DataTypes.STRING(1000),
        allowNull: false,
      },
      creator_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
          USER_CATEGORY.HSP,
        ],
        defaultValue: USER_CATEGORY.DOCTOR,
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
  database.models[TABLE_NAME].belongsToMany(
    database.models[exerciseDetailTableName],
    {
      through: workoutTemplateExerciseMappingTableName,
    }
  );
};
