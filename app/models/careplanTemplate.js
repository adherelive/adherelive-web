"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";
import Treatment from "./treatments";
import Severity from "./severity";
import Conditions from "./conditions";

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

// CarePlanTemplate.hasMany(Treatment, {
//     as: "treatments",
//     foreignKey: 'treatment_id',
//     targetKey: 'id'
// });
//
// CarePlanTemplate.hasMany(Severity, {
//     as: "severity",
//     foreignKey: 'severity_id',
//     targetKey: 'id'
// });
//
// CarePlanTemplate.hasMany(Conditions, {
//     as: "conditions",
//     foreignKey: 'condition_id',
//     targetKey: 'id'
// });

export default CarePlanTemplate;
