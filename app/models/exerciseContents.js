"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as exerciseTableName } from "./exercise";
import { USER_CATEGORY } from "../../constant";

export const TABLE_NAME = "exercise_contents";

export const VIDEO_TYPES = {
  URL: "url",
  UPLOAD: "upload",
  NONE: "none"
};

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
      exercise_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: exerciseTableName,
          },
          key: "id",
        },
      },
      creator_id: {
        type: DataTypes.INTEGER,
      },
      creator_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.ADMIN,
        ],
        defaultValue: USER_CATEGORY.ADMIN,
      },
      video_content_type: {
        type: DataTypes.ENUM,
        values: [VIDEO_TYPES.URL, VIDEO_TYPES.UPLOAD, VIDEO_TYPES.NONE],
        defaultValue: VIDEO_TYPES.NONE
      },
      video_content: {
        type: DataTypes.STRING,
      },
      details: {
        type: DataTypes.JSON,
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

  database.models[TABLE_NAME].belongsTo(
    database.models[exerciseTableName],
    {
      foreignKey: "exercise_id",
      targetKey: "id",
    }
  );
};
