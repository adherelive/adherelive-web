"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, FEATURE_TYPE} from "../../constant";

const FeatureDetails = database.define(
    DB_TABLES.FEATURE_DETAILS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        feature_type: {
            type: Sequelize.ENUM,
            values: [FEATURE_TYPE.APPOINTMENT, FEATURE_TYPE.MEDICATION]
        },
        details: {
            type: Sequelize.JSON,
        },
    },
    {
        underscored: true,
        paranoid: true,
    }
);

export default FeatureDetails;
