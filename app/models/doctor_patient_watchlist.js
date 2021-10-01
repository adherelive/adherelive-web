"use strict";
import { DataTypes } from "sequelize";
import { TABLE_NAME as doctorTableName } from "./doctors";
import { TABLE_NAME as patientTableName } from "./patients";
import { TABLE_NAME as userRoleTableName } from "./userRoles";
import { USER_CATEGORY, SIGN_IN_CATEGORY } from "../../constant";

export const TABLE_NAME = "doctor_patient_watchlists";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
                allowNull: false,
      },
      doctor_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
                        tableName: doctorTableName,
          },
                    key: 'id'
        }
      },
      patient_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
                        tableName: patientTableName,
          },
                    key: 'id'
        }
      },
      user_role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
                        tableName: userRoleTableName,
          },
                    key: 'id'
        }
      }
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            doctor_id: this.doctor_id,
            patients_id: this.patients_id
          };
        }
      }
    }
  );
};

export const associate = (database) => {
  // const {TABLE_NAME} = database.models || {};

  // associations here (if any) ...
  database.models[TABLE_NAME].belongsTo(database.models[doctorTableName], {
    foreignKey: "doctor_id",
    targetKey: "id"
  });

  database.models[TABLE_NAME].belongsTo(database.models[patientTableName], {
    foreignKey: "patient_id",
    targetKey: "id"
  });

  database.models[TABLE_NAME].belongsTo(database.models[userRoleTableName], {
    foreignKey: "user_role_id",
    targetKey: "id"
  });
};
