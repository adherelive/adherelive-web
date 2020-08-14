"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES } from "../../constant";
import Doctors from "./doctors";

const Specialities = database.define(
    DB_TABLES.SPECIALITIES,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING(1000),
        }
    },
    {
        underscored: true,
        paranoid: true,
    }
);

// Specialities.belongsTo(Doctors, {
//     foreignKey: "speciality_id",
//     targetKey:"id"
// });

export default Specialities;