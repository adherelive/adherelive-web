"use strict";
import { DataTypes } from "sequelize";
import { GENDER } from "../../constant";
import { TABLE_NAME as userTableName } from "./users";

export const TABLE_NAME = "patients";

export const db = database => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userTableName
          },
          key: "id"
        }
      },
      gender: {
        type: DataTypes.ENUM,
        values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
        allowNull: true
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true
      },
      age: {
        type: DataTypes.STRING
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: true
      },
      address: {
        type: DataTypes.STRING
      },
      activated_on: {
        type: DataTypes.DATE
      },
      uid: {
        type: DataTypes.STRING
      },
      details: {
        type: DataTypes.JSON
      }
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            user_id: this.user_id,
            gender: this.gender,
            first_name: this.first_name,
            middle_name: this.middle_name,
            last_name: this.last_name,
            address: this.address,
            activated_on: this.activated_on,
            details: this.details
          };
        },
        getId() {
          return this.id;
        }
      }
    }
  );
};

export const associate = database => {

    database.models[TABLE_NAME].belongsTo(database.models[userTableName], {
        foreignKey:"user_id",
        targetKey:"id"
    });
};
