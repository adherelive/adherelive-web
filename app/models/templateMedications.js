"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";
import Medicine from './medicines';
import CarePlanTemplate from "./careplanTemplate";
import TemplateAppointment from "./templateAppointments";

const TemplateMedication = database.define(
    DB_TABLES.TEMPLATE_MEDICATIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
          },
          care_plan_template_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: DB_TABLES.CARE_PLAN_TEMPLATE,
              },
              key: 'id'
            }
          },
          medicine_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
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
                    care_plan_template_id: this.care_plan_template_id,
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


TemplateMedication.hasOne(Medicine, {
    foreignKey: "id",
    targetKey: "medicine_id"
});

TemplateAppointment.belongsTo(CarePlanTemplate, {
    foreignKey:"care_plan_template_id",
    targetKey:"id"
});

export default TemplateMedication;
