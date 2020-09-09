import {database} from "../../libs/mysql";
import Sequelize from "sequelize";
import {VITAL_TEMPLATES} from "./vitalTemplates";
import {CARE_PLANS} from "./carePlan";

// models
import CarePlan from "./carePlan";
import VitalTemplates from "./vitalTemplates";

export const VITALS = "vitals";

const Vitals = database.define(
    VITALS,
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        vital_template_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: VITAL_TEMPLATES,
                },
                key: 'id'
            }
        },
        care_plan_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
                model: {
                    tableName: CARE_PLANS,
                },
                key: 'id'
            }
        },
        details: {
            type: Sequelize.JSON
        },
        response: {
            type: Sequelize.JSON
        },
        description: {
            type: Sequelize.STRING(1000),
        },
        start_date: {
            type: Sequelize.DATE
        },
        end_date: {
            type: Sequelize.DATE
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

Vitals.hasOne(VitalTemplates, {
    foreignKey: "id",
    sourceKey: "vital_template_id"
});

Vitals.hasOne(CarePlan, {
    foreignKey: "id",
    sourceKey: "care_plan_id"
});

export default Vitals;