"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import Doctors from "./doctors";
import Patients from "./patients";
import Medicine from './medicines';

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
          medicine_id: {
            type: Sequelize.INTEGER,
            allowNull: true,
            references: {
              model: {
                tableName: DB_TABLES.MEDICINES,
              },
              key: 'id'
            }
          },
          schedule_data: {
            type: Sequelize.JSON,
            allowNull: true
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
                    medicine_id: this.medicine_id,
                    schedule_data: this.schedule_data,
                };
            },
            getId() {
              return this.id;
            }
        }
    }
);


CarePlanMedication.hasOne(Medicine, {
    foreignKey: "id",
    targetKey: "medicine_id"
});


export default CarePlanMedication;
