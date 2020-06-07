"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";
import Providers from "./providers";
import Regions from "./regions";

const RegionProviders = database.define(
    DB_TABLES.CONDITIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        region_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.REGIONS,
                },
                key: 'id'
            }
        },
        provider_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.PROVIDERS,
                },
                key: 'id'
            }
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    region_id: this.region_id,
                    provider_id: this.provider_id,
                };
            }
        }
    }
);

RegionProviders.hasOne(Regions, {
    foreignKey: "region_id",
    targetKey: "id"
});

RegionProviders.hasOne(Providers, {
    foreignKey: "provider_id",
    targetKey: "id"
});

export default RegionProviders;
