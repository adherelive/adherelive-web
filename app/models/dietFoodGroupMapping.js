"use strict";
import {DataTypes} from "sequelize";
import {TABLE_NAME as foodGroupTableName} from "./foodGroups";
import {TABLE_NAME as dietTableName} from "./diet";
import {TABLE_NAME as similarFoodMappingTableName} from "./similarFoodMapping";

export const TABLE_NAME = "diet_food_group_mappings";

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
            time: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            food_group_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            diet_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...

    database.models[TABLE_NAME].hasOne(database.models[foodGroupTableName], {
        foreignKey: "id",
        sourceKey: "food_group_id"
    });

    database.models[TABLE_NAME].hasOne(database.models[dietTableName], {
        foreignKey: "id",
        sourceKey: "diet_id"
    });

    database.models[TABLE_NAME].hasMany(database.models[similarFoodMappingTableName], {
        foreignKey: "related_to_id",
        sourceKey: "id",
    });

    database.models[TABLE_NAME].hasMany(database.models[similarFoodMappingTableName], {
        foreignKey: "secondary_id",
        sourceKey: "id",
    });
};
