"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES} from "../../constant";

const TemplateAppointment = database.define(
    DB_TABLES.TEMPLATE_APPOINTMENTS,
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
  reason: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  time_gap: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  details: {
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
                time_gap: this.time_gap,
                details: this.details,
            };
        },
        getId() {
          return this.id;
        }
    }
}
);


export default TemplateAppointment;