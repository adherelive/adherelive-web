"use strict";
import {DataTypes} from "sequelize";
// import {TABLE_NAME as exerciseUserCreatedMappingTableName} from "./exerciseUserCreatedMapping";
import {TABLE_NAME as exerciseDetailsTableName} from "./exerciseDetails";
import {USER_CATEGORY} from "../../constant";

export const TABLE_NAME = "exercises";

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
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.HSP,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
        defaultValue: USER_CATEGORY.ADMIN,
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // database.models[TABLE_NAME].hasOne(database.models[repetitionTableName], {
  //   foreignKey: "default_repetition_id",
  //   targetKey: "id",
  // });
  
  // database.models[TABLE_NAME].hasOne(database.models[exerciseUserCreatedMappingTableName], {
  //   foreignKey: "exercise_id",
  //   targetKey: "id"
  // });
  
  database.models[TABLE_NAME].hasMany(
    database.models[exerciseDetailsTableName],
    {
      foreignKey: "exercise_id",
      sourceKey: "id",
    }
  );
};
