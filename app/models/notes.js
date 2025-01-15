"use strict";
import { DataTypes } from "sequelize";
import { USER_CATEGORY } from "../../constant";
import { TABLE_NAME as patientsTableName } from "./patients";
import { TABLE_NAME as doctorsTableName } from "./doctors";
import { TABLE_NAME as providersTableName } from "./providers";

export const TABLE_NAME = "notes";

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
      patient_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: patientsTableName,
          },
          key: "id",
        },
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: doctorsTableName,
          },
          key: "id",
        },
      },
      provider_id: {
        type: DataTypes.INTEGER,
        references: {
          model: {
            tableName: providersTableName,
          },
          key: "id",
        },
      },
      provider_type: {
        type: DataTypes.ENUM,
        values: [
          USER_CATEGORY.DOCTOR,
          USER_CATEGORY.PROVIDER,
          USER_CATEGORY.HSP,
        ],
      },
      notes: {
        type: DataTypes.JSON,
      },
      data: {
        type: DataTypes.JSON,
      },
      notes_type: {
        type: DataTypes.STRING,
      },
      notes_type_id: {
        type: DataTypes.INTEGER,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            provider_id: this.provider_id,
          };
        },
      },
    }
  );
};
export const associate = (database) => {
  database.models[TABLE_NAME].belongsTo(database.models[patientsTableName], {
    foreignKey: "patient_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].belongsTo(database.models[doctorsTableName], {
    foreignKey: "doctor_id",
    targetKey: "id",
  });
};
