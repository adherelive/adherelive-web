"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import Doctors from "./doctors";
import Patients from "./patients";
import Medicine from './medicines';

const CarePlanAppointment = database.define(
    DB_TABLES.CARE_PLAN_APPOINTMENTS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          care_plan_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: DB_TABLES.CARE_PLANS,
              },
              key: 'id'
            }
          },
          reason: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          appointment_time: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          details: {
            type: Sequelize.JSON,
            allowNull: true
          }
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    care_plan_id: this.care_plan_id,
                    reason: this.reason,
                    appointment_time: this.appointment_time,
                    details:this.details
                };
            },
            getId() {
              return this.id;
            }
        }
    }
);





export default CarePlanAppointment;
