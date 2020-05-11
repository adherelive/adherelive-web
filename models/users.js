"use strict";
import Sequelize from "sequelize";
import { database } from "../libs/mysql";

// class Users extends Model {
//   static init( sequelize) {
//     super.init(
//       {
//         user_name: DataTypes.STRING(100),
//         category: DataTypes.ENUM(
//           "patient",
//           "care_taker",
//           "doctor",
//           "provider",
//           "admin"
//         ),
//         email: DataTypes.STRING,
//         sign_in_type: DataTypes.ENUM("basic", "google", "facebook"),
//         password: DataTypes.STRING(1000),
//         activated_on: DataTypes.DATE
//       },
//       {
//         sequelize
//       }
//     );
//   }
//
//   static associate(sequelize) {}
// }

const Users = (sequelize, DataTypes) => {
  const users = sequelize.define(
    "users",
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
    {}
  );
  users.associate = function(models) {
    // associations can be defined here
  };
  return users;
};

export default Users(database, Sequelize);
