"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";
import Treatment from "./treatments";
import Severity from "./severity";
import Conditions from "./conditions";
import TemplateAppointment from "./templateAppointments";
import TemplateMedication from "./templateMedications";

const CarePlanTemplate = database.define(
  DB_TABLES.CARE_PLAN_TEMPLATE,
  {
    id: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: Sequelize.INTEGER
    },
    name: {
      type: Sequelize.STRING,
      allowNull: false
    },
    treatment_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: DB_TABLES.TREATMENTS
        },
        key: "id"
      }
    },
    severity_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: DB_TABLES.SEVERITY
        },
        key: "id"
      }
    },
    condition_id: {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: {
          tableName: DB_TABLES.CONDITIONS
        },
        key: "id"
      }
    },
      user_id: {
          type: Sequelize.INTEGER,
          allowNull: true,
          references: {
              model: {
                  tableName: DB_TABLES.USERS,
              },
              key: "id",
          },
      },
    details: {
      type: Sequelize.JSON
    }
  },
  {
    underscored: true,
    paranoid: true,
    getterMethods: {
      getBasicInfo() {
        return {
          id: this.id,
          type: this.type,
          severity: this.severity,
          condition: this.condition,
          details: this.details
        };
      }
    }
  }
);

CarePlanTemplate.hasOne(Treatment, {
    foreignKey: "id",
    sourceKey: "treatment_id"
});

CarePlanTemplate.hasOne(Severity, {
    foreignKey: "id",
    sourceKey: "severity_id"
});

CarePlanTemplate.hasOne(Conditions, {
    foreignKey: "id",
    sourceKey: "condition_id"
});

CarePlanTemplate.hasMany(TemplateAppointment, {
    foreignKey:"care_plan_template_id",
    sourceKey:"id",
});
CarePlanTemplate.hasMany(TemplateMedication, {
    foreignKey:"care_plan_template_id",
    sourceKey:"id",
});

CarePlanTemplate.hasMany(TemplateAppointment, {
    foreignKey:"care_plan_template_id",
    sourceKey:"id"
});

CarePlanTemplate.hasMany(TemplateMedication, {
    foreignKey:"care_plan_template_id",
    sourceKey:"id"
});

export default CarePlanTemplate;
