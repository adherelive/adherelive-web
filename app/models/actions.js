"use strict";
import { DataTypes } from "sequelize";
import { CARE_PLANS } from "./carePlan";
import { ACTION_TYPE } from "../../constant";

export const ACTIONS = "actions";

export const db = (database) => {
  database.define(
    ACTIONS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      care_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: CARE_PLANS,
          },
          key: "id",
        },
      },
      type: {
        type: DataTypes.ENUM,
        values: [ACTION_TYPE.MEDICATION, ACTION_TYPE.WORKOUT, ACTION_TYPE.DIET],
        allowNull: false,
      },
      frequency_per_day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      reference_link: {
        type: DataTypes.STRING(1000),
      },
      start_date: {
        type: DataTypes.DATE,
      },
      end_date: {
        type: DataTypes.DATE,
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
            type: this.type,
            frequency_per_day: this.frequency_per_day,
            reference_link: this.reference_link,
            start_date: this.start_date,
            end_date: this.end_date,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const { actions, care_plans } = database.models || {};

  // associations here (if any) ...
  actions.belongsTo(care_plans, {
    foreignKey: "care_plan_id",
    targetKey: "id",
  });
};
