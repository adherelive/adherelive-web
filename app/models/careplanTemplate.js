"use strict";
import {DataTypes} from "sequelize";
import {TREATMENTS} from "./treatments";
import {SEVERITY} from "./severity";
import {CONDITIONS} from "./conditions";
import {USERS} from "./users";

export const CARE_PLAN_TEMPLATES = "care_plan_templates";

export const db = database => {
  database.define(
    CARE_PLAN_TEMPLATES,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      treatment_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: TREATMENTS
          },
          key: "id"
        }
      },
      severity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: SEVERITY
          },
          key: "id"
        }
      },
      condition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: CONDITIONS
          },
          key: "id"
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: USERS
          },
          key: "id"
        }
      },
      details: {
        type: DataTypes.JSON
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
};

export const associate = database => {
  const {
    care_plan_templates,
    treatments,
    severity,
    conditions,
    template_appointments,
    template_medications
  } = database.models || {};

  // associations here (if any) ...
  care_plan_templates.hasOne(treatments, {
    foreignKey: "id",
    sourceKey: "treatment_id"
  });

  care_plan_templates.hasOne(severity, {
    foreignKey: "id",
    sourceKey: "severity_id"
  });

  care_plan_templates.hasOne(conditions, {
    foreignKey: "id",
    sourceKey: "condition_id"
  });

  care_plan_templates.hasMany(template_appointments, {
    foreignKey: "care_plan_template_id",
    sourceKey: "id"
  });
  care_plan_templates.hasMany(template_medications, {
    foreignKey: "care_plan_template_id",
    sourceKey: "id"
  });
};
