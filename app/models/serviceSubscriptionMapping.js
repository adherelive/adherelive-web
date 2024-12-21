"use strict";

import { DataTypes } from "sequelize";
import { TABLE_NAME as servicePlanTableName } from "./serviceOffering";
import { TABLE_NAME as subscriptionPlanTableName } from "./serviceSubscriptions";

export const TABLE_NAME = "service_subscribe_plan_mappings";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER,
      },
      subscription_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: subscriptionPlanTableName,
          },
          key: "id",
        },
      },
      service_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: servicePlanTableName,
          },
          key: "id",
        },
      },
      service_frequency: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      underscored: true,
      paranoid: true,
      getterMethods: {
        getBasicInfo() {
          return {
            id: this.id,
            service_plan_id: this.service_plan_id,
            subscription_plan_id: this.subscription_plan_id,
          };
        },
      },
    }
  );
};

export const associate = (database) => {
  const {
    service_subscribe_plan_mappings: ServiceSubscribePlanMapping,
    service_subscription: ServiceSubscription,
    service_offering: ServiceOffering,
  } = database.models || {};

  if (ServiceSubscribePlanMapping && ServiceSubscription && ServiceOffering) {
    ServiceSubscribePlanMapping.belongsTo(ServiceSubscription, {
      foreignKey: "subscription_plan_id",
      targetKey: "id",
    });
    ServiceSubscribePlanMapping.belongsTo(ServiceOffering, {
      foreignKey: "service_plan_id",
      targetKey: "id",
    });
  } else {
    console.error("One or more models are undefined");
  }
};
