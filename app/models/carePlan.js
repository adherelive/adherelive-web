"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as doctorTableName } from "./doctors";
import { TABLE_NAME as patientTableName } from "./patients";
import { TABLE_NAME as carePlanTemplateTableName } from "./careplanTemplate";
import { TABLE_NAME as carePlanAppointmentTableName } from "./carePlanAppointments";
import { TABLE_NAME as carePlanMedicationTableName } from "./carePlanMedications";
import { TABLE_NAME as userRolesTableName } from "./userRoles";
import { TABLE_NAME as careplanSecondaryDoctorMappingsTableName } from "./careplanSecondaryDoctorMappings";

export const TABLE_NAME = "care_plans";

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
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: doctorTableName
          },
          key: "id"
        }
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: patientTableName
          },
          key: "id"
        }
      },
      care_plan_template_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: carePlanTemplateTableName
          },
          key: "id"
        }
      },
      details: {
        type: DataTypes.JSON
      },
      activated_on: {
        type: DataTypes.DATE
      },
      renew_on: {
        type: DataTypes.DATE
      },
      user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: {
            tableName: userRolesTableName
          },
          key: "id"
        }
      },
      channel_id: {
        type: DataTypes.STRING
      },
      expired_on: {
        type: DataTypes.DATE
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false
      }
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            // name: this.name,
            // condition_id: this.condition_id,
            // consent_id: this.consent_id,
            doctor_id: this.doctor_id,
            patient_id: this.patient_id,
            details: this.details,
            activated_on: this.activated_on,
            renew_on: this.renew_on,
            expired_on: this.expired_on
          };
        },
        getId() {
          return this.id;
        }
      }
    }
  );
};

export const associate = database => {
  // associations here (if any) ...
  database.models[TABLE_NAME].belongsTo(database.models[patientTableName], {
    foreignKey: "patient_id",
    targetKey: "id"
    // foreignKey: "user_id",
    // targetKey: "id"
  });

  database.models[TABLE_NAME].belongsTo(database.models[userRolesTableName], {
    foreignKey: "user_role_id",
    targetKey: "id"
  });

  database.models[TABLE_NAME].hasOne(database.models[doctorTableName], {
    foreignKey: "id",
    sourceKey: "doctor_id"
  });

  database.models[TABLE_NAME].hasMany(
    database.models[carePlanAppointmentTableName],
    {
      foreignKey: "care_plan_id",
      sourceKey: "id"
    }
  );

  database.models[TABLE_NAME].hasMany(
    database.models[carePlanMedicationTableName],
    {
      foreignKey: "care_plan_id",
      sourceKey: "id"
    }
  );

  database.models[TABLE_NAME].hasMany(
    database.models[careplanSecondaryDoctorMappingsTableName],
    {
      foreignKey: "care_plan_id",
      sourceKey: "id"
    }
  );
};
