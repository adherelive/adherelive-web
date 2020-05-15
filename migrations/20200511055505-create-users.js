"use strict";

import { DB_TABLES } from "../constant";
// import { dataType } from "db-migrate";
//
// var dbm;
// var type;
// var seed;
//
// exports.setup = function(options, seedLink) {
//   dbm = options.dbmigrate;
//   type = dbm.dataType;
//   seed = seedLink;
// };
//
// exports.up = function(db, callback) {
//   db.createTable(
//       DB_TABLES.USERS,
//       {
//         id: {
//           type: dataType.INTEGER,
//           primaryKey: true,
//           autoIncrement: true,
//           unsigned: true
//         },
//
//         user_name: {
//           type: dataType.STRING,
//           notNull: true,
//           unique: true,
//         },
//         email: {
//           type: dataType.STRING,
//           notNull: true,
//           unique: true,
//         },
//         password: {
//           type: dataType.STRING,
//           notNull: true
//         },
//         sign_in_type: {
//         type: dataType.ENUM,
//         values: ["basic", "google", "facebook"],
//         allowNull: false
//       },
// //       category: {
// //         type: Sequelize.ENUM,
// //         values: ["patient", "care_taker", "doctor", "provider", "admin"],
// //         allowNull: false
// //       },
// //       activated_on: {
// //         type: Sequelize.DATE
// //       },
//         created_at: {
//           type: dataType.DATE_TIME
//         },
//         updated_at: {
//           type: dataType.DATE_TIME
//         },
//         deleted_at: {
//           type: dataType.DATE_TIME
//         }
//       },
//       callback
//   );
// };

module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable(DB_TABLES.USERS, {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      user_name: {
        type: Sequelize.STRING
      },
      email: {
        type: Sequelize.STRING,
        allowNull: false
      },
      password: {
        type: Sequelize.STRING(1000),
        allowNull: false
      },
      sign_in_type: {
        type: Sequelize.ENUM,
        values: ["basic", "google", "facebook"],
        allowNull: false
      },
      category: {
        type: Sequelize.ENUM,
        values: ["patient", "care_taker", "doctor", "provider", "admin"],
        allowNull: false
      },
      activated_on: {
        type: Sequelize.DATE
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE
      },
      deleted_at: {
        allowNull: true,
        type: Sequelize.DATE
      }
    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable("users");
  }
};

// exports.down = function(db, callback) {
//   db.dropTable(DB_TABLES.USERS, callback);
// };