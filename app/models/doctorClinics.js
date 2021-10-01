"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as doctorTableName } from "./doctors";

export const TABLE_NAME = "doctor_clinics";

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
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
                        tableName: doctorTableName,
          },
                    key: 'id'
        }
      },
      name: {
        type: DataTypes.STRING(200),
                allowNull: false,
      },
      location: {
        type: DataTypes.STRING(400),
                allowNull: false,
      },
      details: {
        type: DataTypes.JSON,
        allowNull: true
      }
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            doctor_id: this.doctor_id,
            name: this.name,
            location: this.location,
            start_time: this.start_time,
            end_time: this.end_time,
            details: this.details
          };
        }
      }
    }
  );
};

export const associate = (database) => {
  const { doctor_clinics, doctors } = database.models || {};

  // associations here (if any) ...
  doctor_clinics.belongsTo(doctors, {
    foreignKey: "doctor_id",
    targetKey: "id"
  });
};
