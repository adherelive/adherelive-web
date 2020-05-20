"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {ARTICLE_TYPE, DB_TABLES} from "../../constant";

const Articles = database.define(
    DB_TABLES.ARTICLES,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        type: {
            type: Sequelize.ENUM,
            values: [ARTICLE_TYPE.VIDEO, ARTICLE_TYPE.IMAGE, ARTICLE_TYPE.PDF]
        },
        description: {
            type: Sequelize.STRING(1000),
        },
        url: {
            type: Sequelize.STRING(1000),
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    type: this.type,
                    description: this.description,
                    url: this.url,
                };
            }
        }
    }
);

export default Articles;
