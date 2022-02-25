"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as userTableName } from "./users";
import { TABLE_NAME as specialityTableName } from "./specialities";
import { BLANK_STATE, GENDER } from "../../constant";

export const TABLE_NAME = "doctors";

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
      city: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      speciality_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: specialityTableName,
          },
          key: "id",
        },
      },
      gender: {
        type: DataTypes.ENUM,
        values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER, BLANK_STATE],
        allowNull: true,
      },
      profile_pic: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      first_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      middle_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      last_name: {
        type: DataTypes.STRING(100),
        allowNull: true,
      },
      activated_on: {
        type: DataTypes.DATE,
      },
      signature_pic: {
        type: DataTypes.STRING,
        allowNull: true,
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
            profile_pic: this.profile_pic,
            first_name: this.first_name,
            middle_name: this.middle_name,
            last_name: this.last_name,
            address: this.address,
            city: this.city,
            speciality: this.speciality,
            registration_council: this.registration_council,
            registration_year: this.registration_year,
            registration_number: this.registration_number,
            activated_on: this.activated_on,
            signature_pic: this.signature_pic,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  // associations here (if any) ...

  database.models[TABLE_NAME].belongsTo(database.models[userTableName], {
    foreignKey: "user_id",
    targetKey: "id",
  });

  database.models[TABLE_NAME].hasOne(database.models[specialityTableName], {
    foreignKey: "id",
    sourceKey: "speciality_id",
  });
};
