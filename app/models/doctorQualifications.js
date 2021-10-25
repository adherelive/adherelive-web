"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as doctorTableName } from "./doctors";
import { TABLE_NAME as degreeTableName } from "./degree";
import { TABLE_NAME as collegeTableName } from "./college";

export const TABLE_NAME = "doctor_qualifications";

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
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: doctorTableName,
          },
          key: "id",
        },
      },
      degree_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: degreeTableName,
          },
          key: "id",
        },
      },
      college_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: collegeTableName,
          },
          key: "id",
        },
      },
      year: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            doctor_id: this.doctor_id,
            degree: this.degree,
            year: this.year,
            college: this.college,
            // photos: this.photos
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // associations here (if any) ...
  database.models[TABLE_NAME].belongsTo(database.models[doctorTableName], {
    foreignKey: "doctor_id",
    targetKey: "id",
  });
};
