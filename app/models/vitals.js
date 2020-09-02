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
    },
    {
        underscored: true,
        paranoid: true,
    }
);

Vitals.hasOne(VitalTemplates, {

});

Vitals.belongsTo(CarePlan, {

});

export default Vitals;