"use strict";
import {DataTypes} from "sequelize";
import {ARTICLE_TYPE} from "../../constant";

export const ARTICLES = "articles";

export const db = (database) => {
    database.define(
        ARTICLES,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            type: {
                type: DataTypes.ENUM,
                values: [ARTICLE_TYPE.VIDEO, ARTICLE_TYPE.IMAGE, ARTICLE_TYPE.PDF]
            },
            description: {
                type: DataTypes.STRING(1000),
            },
            url: {
                type: DataTypes.STRING(1000),
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
};

export const associate = (database) => {
    // const {TABLE_NAME} = database.models || {};

    // associations here (if any) ...
};