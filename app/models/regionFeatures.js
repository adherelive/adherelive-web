"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";
import Features from "./features";

const RegionFeatures = database.define(
    DB_TABLES.REGION_FEATURES,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        feature_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.FEATURES,
                },
                key: 'id'
            }
        },
        activated_on: {
            type: Sequelize.DATE,
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    name:this.name,
                };
            }
        }
    }
);

RegionFeatures.belongsTo(Features, {
    foreignKey:"feature_id",
    targetKey:"id"
});

export default RegionFeatures;
