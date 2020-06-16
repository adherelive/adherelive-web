"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY, SIGN_IN_CATEGORY, GENDER} from "../../constant";
import Doctors from "./doctors";

const DoctorClinics = database.define(
    DB_TABLES.DOCTOR_CLINICS,
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
          name: {
            type: Sequelize.STRING(200),
            allowNull: false,
          },
          location: {
            type: Sequelize.STRING(400),
            allowNull: false,
          },
          start_time: {
            type: Sequelize.DATE
          },
          end_time:{
            type:Sequelize.DATE
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
                    end_time: this.end_time
                };
            }
        }
    }
);

DoctorClinics.belongsTo(Doctors, {
   foreignKey:"doctor_id",
    targetKey:"id"
});

export default DoctorClinics;
