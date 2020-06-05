"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY} from "../../constant";
import Providers from "./providers";

const ProviderMembers = database.define(
    DB_TABLES.PROVIDER_MEMBERS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
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
        member_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.ADMIN, USER_CATEGORY.PROVIDER],
            allowNull: false
        },
        member_id: {
            type: Sequelize.INTEGER,
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
                    provider_id: this.provider_id,
                    member_type: this.member_type,
                    member_id: this.member_id
                };
            }
        }
    }
);

ProviderMembers.belongsTo(Providers, {
    foreignKey: "provider_id",
    targetKey: "id"
});

export default ProviderMembers;
