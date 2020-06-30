"use strict";
import Sequelize from "sequelize";
import { database } from "../../libs/mysql";
import { DB_TABLES, MEDICINE_TYPE } from "../../constant";

const Medicines = database.define(
    DB_TABLES.MEDICINES,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        name: {
            type: Sequelize.STRING(1000),
            allowNull: false,
        },
        type: {
            type: Sequelize.ENUM,
            values: [MEDICINE_TYPE.TABLET, MEDICINE_TYPE.INJECTION],
            defaultValue: MEDICINE_TYPE.TABLET
        },
        description: {
            type: Sequelize.STRING(1000),
        },
        pillbox_id: {
            type: Sequelize.INTEGER,
        }
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    name:this.name,
                    description: this.description
                };
            }
        }
    }
);

export default Medicines;
