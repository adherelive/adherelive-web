"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY, SIGN_IN_CATEGORY, GENDER} from "../../constant";
import Doctors from "./doctors";

const DoctorQualifications = database.define(
    DB_TABLES.DOCTOR_QUALIFICATIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          doctor_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: DB_TABLES.DOCTORS,
              },
              key: 'id'
            }
          },
        degree_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.DEGREE,
                },
                key: 'id'
            }
        },
          college: {
            type: Sequelize.STRING(100),
            allowNull: false,
          },
          year: {
            type: Sequelize.INTEGER,
            allowNull: false,
          },
          // photos:{
          //   type: Sequelize.JSON
          // }
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    doctor_id: this.doctor_id,
                    degree: this.degree,
                    year: this.year,
                    college: this.college,
                    // photos: this.photos
                };
            }
        }
    }
);

DoctorQualifications.belongsTo(Doctors, {
   foreignKey:"doctor_id",
    targetKey:"id"
});

export default DoctorQualifications;
