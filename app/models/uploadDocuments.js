"use strict";
import {DataTypes} from "sequelize";

export const UPLOAD_DOCUMENTS = "upload_documents";

export const db = (database) => {
    database.define(
        UPLOAD_DOCUMENTS,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            parent_type: {
                type: DataTypes.STRING(200),
                allowNull: false
            },
            parent_id: {
                allowNull: false,
                type: DataTypes.INTEGER
            },
            document: {
                type: DataTypes.STRING(1000),
                allowNull: false
            },
            name: {
                type: DataTypes.STRING(1000)
            }
        },
        {
            underscored: true,
            paranoid: true,
            getterMethods: {
                getBasicInfo() {
                    return {
                        id: this.id,
                        parent_type: this.parent_type,
                        parent_id: this.parent_id,
                        document: this.document
                    };
                }
            }
        }
    );
};

export const associate = (database) => {
    // const {upload_documents} = database.models || {};

    // associations here (if any) ...
};