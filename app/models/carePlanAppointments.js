"use strict";
import {DataTypes} from "sequelize";
import { CARE_PLANS } from "./carePlan";
import {APPOINTMENTS} from "./appointments";

export const CARE_PLAN_APPOINTMENTS = "care_plan_appointments";

export const db = (database) => {
  database.define(
      CARE_PLAN_APPOINTMENTS,
      {
        id: {
          allowNull: false,
          autoIncrement: true,
          primaryKey: true,
          type: DataTypes.INTEGER
        },
        care_plan_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: CARE_PLANS,
            },
            key: 'id'
          }
        },
        appointment_id: {
          type: DataTypes.INTEGER,
          allowNull: false,
          references: {
            model: {
              tableName: APPOINTMENTS,
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
};

export const associate = (database) => {
  const {care_plan_appointments, appointments} = database.models || {};

  // associations here (if any) ...
  care_plan_appointments.hasOne(appointments, {
    foreignKey: "id",
    targetKey: "appointment_id"
  });
};

// CarePlanAppointment.belongsTo(CarePlan, {
//   foreignKey:"care_plan_id",
//   targetKey:"id"
// });