import {database} from "../../libs/mysql";
import Sequelize from "sequelize";

export const VITAL_TEMPLATES = "vital_templates";

const VitalTemplates = database.define(
    VITAL_TEMPLATES,
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
        unit: {
            type: Sequelize.STRING,
        },
        details: {
            type: Sequelize.JSON
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default VitalTemplates;