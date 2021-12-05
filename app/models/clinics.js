"use strict";
import {DataTypes} from "sequelize";
import {CONSENTS} from "./consents";

export const CLINICS = "clinics";

export const db = (database) => {
  database.define(
    CLINICS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      consent_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: CONSENTS,
          },
          key: 'id'
        }
      },
      activated_on: {
        type: DataTypes.DATE
      },
      expired_on: {
        type: DataTypes.DATE,
        allowNull: false
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            name: this.name,
            consent_id: this.consent_id,
            activated_on: this.activated_on,
            expired_on: this.expired_on
          };
        }
      }
    }
  );
};

export const associate = (database) => {
  const {clinics, consents} = database.models || {};
  
  // associations here (if any) ...
  // clinics.hasOne(consents, {
  //     foreignKey: "consent_id",
  //     targetKey: "id"
  // });
};
