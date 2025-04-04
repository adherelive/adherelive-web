"use strict";
import { DataTypes } from "sequelize";
import { BLANK_STATE, GENDER } from "../../constant";
import { TABLE_NAME as userTableName } from "./users";
import { TABLE_NAME as reportTableName } from "./reports";
import { TABLE_NAME as carePlanTableName } from "./carePlan";

export const TABLE_NAME = "patients";

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
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: userTableName,
          },
          key: "id",
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER, BLANK_STATE],
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value) {
          if (value) {
            this.setDataValue(
              "first_name",
              value.charAt(0).toUpperCase() + value.slice(1)
            );
          } else {
            this.setDataValue("first_name", null);
          }
        },
      },
      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value) {
          if (value) {
            this.setDataValue(
              "middle_name",
              value.charAt(0).toUpperCase() + value.slice(1)
            );
          } else {
            this.setDataValue("middle_name", null);
          }
        },
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
        set(value) {
          if (value) {
            this.setDataValue(
              "last_name",
              value
                .split(" ")
                .map((text) => text.charAt(0).toUpperCase() + text.slice(1))
                .join(" ")
            );
          } else {
            this.setDataValue("last_name", null);
          }
        },
      },
      age: {
        type: DataTypes.STRING,
      },
      dob: {
        type: DataTypes.DATE,
        allowNull: true,
      },
      address: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      height: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      weight: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      activated_on: {
        type: DataTypes.DATE,
      },
      uid: {
        type: DataTypes.STRING,
      },
      details: {
        type: DataTypes.JSON,
      },
      payment_terms_accepted: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      full_name: {
        type: DataTypes.VIRTUAL,
        get() {
          return !this.first_name
            ? null
            : `${this.first_name}${
                this.middle_name ? ` ${this.middle_name}` : ""
              }${this.last_name ? ` ${this.last_name}` : ""}`;
        },
      },
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
            details: this.details,
            height: this.height,
            weight: this.weight,
          };
        },
        getId() {
          return this.id;
        },
      },
    }
  );
};

export const associate = (database) => {
  database.models[TABLE_NAME].belongsTo(database.models[userTableName], {
    foreignKey: "user_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].hasMany(database.models[reportTableName], {
    foreignKey: "patient_id",
  });

  database.models[TABLE_NAME].belongsTo(database.models[carePlanTableName], {
    foreignKey: "id",
    targetKey: "patient_id",
  });
};
