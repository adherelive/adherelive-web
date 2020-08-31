"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import {
  DB_TABLES,
  USER_CATEGORY,
  SIGN_IN_CATEGORY,
  GENDER
} from "../../constant";

const Patients = database.define(
  DB_TABLES.PATIENTS,
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    user_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: DB_TABLES.USERS
        },
        key: "id"
      }
    },
    gender: {
      type: Sequelize.ENUM,
      values: [GENDER.MALE, GENDER.FEMALE, GENDER.OTHER],
      allowNull: true
    },
    first_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    middle_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    last_name: {
      type: Sequelize.STRING(100),
      allowNull: true
    },
    age: {
      type: Sequelize.STRING,
    },
    dob: {
      type: Sequelize.DATE,
      allowNull: true,
    },
    address: {
      type: Sequelize.STRING
    },
    activated_on: {
      type: Sequelize.DATE
    },
    uid: {
      type: Sequelize.STRING,
    },
    details: {
      type: Sequelize.JSON
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

export default Patients;
