"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import Doctors from "./doctors";
import Patients from "./patients";
import Medication from './medicationReminders';
import CarePlan from "./carePlan";
import CarePlanAppointment from "./carePlanAppointments";

const CarePlanMedication = database.define(
    DB_TABLES.CARE_PLAN_MEDICATIONS,
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
          medication_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: DB_TABLES.MEDICATION_REMINDERS,
              },
              key: 'id'
            }
          },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    care_plan_id: this.care_plan_id,
                    medication_id: this.medication_id,
                };
            },
            getId() {
              return this.id;
            }
        }
    }
);


CarePlanMedication.hasOne(Medication, {
    foreignKey: "id",
    targetKey: "medication_id"
});


export default CarePlanMedication;
