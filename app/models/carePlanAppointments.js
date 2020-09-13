"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";
import Appointment from './appointments';
import CarePlan from "./carePlan";

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
    appointment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: DB_TABLES.APPOINTMENTS,
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
          appointment_id: this.appointment_id
        };
      },
      getId() {
        return this.id;
      }
    }
  }
);

CarePlanAppointment.hasOne(Appointment, {
  foreignKey: "id",
  targetKey: "appointment_id"
});

// CarePlanAppointment.belongsTo(CarePlan, {
//   foreignKey:"care_plan_id",
//   targetKey:"id"
// });



export default CarePlanAppointment;
