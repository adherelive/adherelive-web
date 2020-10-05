"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as treatmentTableName} from "./treatments";
import {TABLE_NAME as severityTableName} from "./severity";
import {TABLE_NAME as conditionTableName} from "./conditions";
import {TABLE_NAME as userTableName} from "./users";
import {TABLE_NAME as appointmentTemplateTableName} from "./templateAppointments";
import {TABLE_NAME as medicationTemplateTableName} from "./templateMedications";

export const TABLE_NAME = "care_plan_templates";

export const db = database => {
  database.define(
    TABLE_NAME,
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
            tableName: treatmentTableName
          },
          key: "id"
        }
      },
      severity_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: severityTableName
          },
          key: "id"
        }
      },
      condition_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: conditionTableName
          },
          key: "id"
        }
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: userTableName
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

  // associations here (if any) ...
  database.models[TABLE_NAME].hasOne(database.models[treatmentTableName], {
    foreignKey: "id",
    sourceKey: "treatment_id"
  });

  database.models[TABLE_NAME].hasOne(database.models[severityTableName], {
    foreignKey: "id",
    sourceKey: "severity_id"
  });

  database.models[TABLE_NAME].hasOne(database.models[conditionTableName], {
    foreignKey: "id",
    sourceKey: "condition_id"
  });

  database.models[TABLE_NAME].hasMany(database.models[appointmentTemplateTableName], {
    foreignKey: "care_plan_template_id",
    sourceKey: "id"
  });
  database.models[TABLE_NAME].hasMany(database.models[medicationTemplateTableName], {
    foreignKey: "care_plan_template_id",
    sourceKey: "id"
  });
};
