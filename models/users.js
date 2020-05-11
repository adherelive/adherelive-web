"use strict";
import { Model, DataTypes } from "sequelize";
import { database } from "../libs/postgress";

class Users extends Model {
  static init(database, sequelize) {
    super.init(
      {
        user_name: DataTypes.STRING(100),
        category: DataTypes.ENUM(
          "patient",
          "care_taker",
          "doctor",
          "provider",
          "admin"
        ),
        email: DataTypes.STRING,
        sign_in_type: DataTypes.ENUM("basic", "google", "facebook"),
        password: DataTypes.STRING(1000),
        activated_on: DataTypes.DATE
      },
      {
        sequelize
      }
    );
  }

  static associate(sequelize) {}
}

export default Users;
