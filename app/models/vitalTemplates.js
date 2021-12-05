import {DataTypes} from "sequelize";

export const TABLE_NAME = "vital_templates";

export const db = (database) => {
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
        allowNull: false,
      },
      unit: {
        type: DataTypes.STRING,
      },
      details: {
        type: DataTypes.JSON
      },
    },
    {
      underscored: true,
      paranoid: true,
    }
  );
};

export const associate = (database) => {
  // const {upload_documents} = database.models || {};
  
  // associations here (if any) ...
};