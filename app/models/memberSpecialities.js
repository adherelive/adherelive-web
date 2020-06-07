"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY} from "../../constant";
import Specialities from "./specialities";

const MemberSpecialities = database.define(
    DB_TABLES.MEMBER_SPECIALITIES,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        speciality_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: DB_TABLES.SPECIALITIES,
                },
                key: 'id'
            }
        },
        member_type: {
            type: Sequelize.ENUM,
            values: [USER_CATEGORY.DOCTOR, USER_CATEGORY.PROVIDER]
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
                    speciality_id: this.speciality_id,
                    member_type: this.member_type,
                    member_id: this.member_id
                };
            }
        }
    }
);

MemberSpecialities.belongsTo(Specialities, {
    foreignKey: "speciality_id",
    targetKey: "id"
});

export default MemberSpecialities;
