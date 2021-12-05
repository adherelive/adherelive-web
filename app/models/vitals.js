import {DataTypes} from "sequelize";
import {TABLE_NAME as vitalTemplatesTableName} from "./vitalTemplates";
import {TABLE_NAME as carePlanTableName} from "./carePlan";

export const TABLE_NAME = "vitals";

export const db = (database) => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      vital_template_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: vitalTemplatesTableName,
          },
          key: "id",
        },
      },
      care_plan_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: carePlanTableName,
          },
          key: "id",
        },
      },
      details: {
        type: DataTypes.JSON,
      },
      description: {
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
    }
  );
};

export const associate = (database) => {
  // associations here (if any) ...
  database.models[TABLE_NAME].hasOne(database.models[vitalTemplatesTableName], {
    foreignKey: "id",
    sourceKey: "vital_template_id",
  });
  
  database.models[TABLE_NAME].hasOne(database.models[carePlanTableName], {
    foreignKey: "id",
    sourceKey: "care_plan_id",
  });
};
