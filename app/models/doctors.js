"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import {
  DB_TABLES,
  USER_CATEGORY,
  SIGN_IN_CATEGORY,
  GENDER,
} from "../../constant";
import Users from "./users";
import Specialities from "./specialities";

const Doctors = database.define(
  DB_TABLES.DOCTORS,
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER,
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: DB_TABLES.USERS,
        },
        key: "id",
      },
    },
    city: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    speciality_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
            model: {
                tableName: DB_TABLES.SPECIALITIES,
            },
            key: 'id'
        }
    },
    gender: {
      type: Sequelize.ENUM,
      values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
      allowNull: true,
    },
    profile_pic: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    first_name: {
      type: Sequelize.STRING(100),
      allowNull: false,
    },
    middle_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    last_name: {
      type: Sequelize.STRING(100),
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    activated_on: {
      type: Sequelize.DATE,
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
        };
      },
    },
  }
);

Doctors.hasOne(Users, {
    foreignKey: "id",
    sourceKey: "user_id"
});

Doctors.hasOne(Specialities, {
    foreignKey: "id",
    sourceKey:"speciality_id"
});

export default Doctors;
