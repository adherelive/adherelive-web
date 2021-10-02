'use strict';

import {TABLE_NAME, VIDEO_TYPES} from "../app/models/exerciseContents";
import {TABLE_NAME as exerciseTableName} from "../app/models/exercise";

import {USER_CATEGORY} from "../constant";

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable(TABLE_NAME, {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            exercise_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: exerciseTableName
                    },
                    key: "id"
                }
            },
            creator_id: {
                type: DataTypes.INTEGER
            },
            creator_type: {
                type: DataTypes.ENUM,
                values: [
                    USER_CATEGORY.DOCTOR,
                    USER_CATEGORY.PROVIDER,
                    USER_CATEGORY.ADMIN,
                ],
                defaultValue: USER_CATEGORY.ADMIN,
            },
            video_content_type: {
                type: DataTypes.ENUM,
                values: [VIDEO_TYPES.URL, VIDEO_TYPES.UPLOAD, VIDEO_TYPES.NONE],
                defaultValue: VIDEO_TYPES.NONE
            },
            video_content: {
                type: DataTypes.STRING,
            },
            details: {
                type: DataTypes.JSON,
            },
            created_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            updated_at: {
                allowNull: false,
                type: DataTypes.DATE
            },
            deleted_at: {
                allowNull: true,
                type: DataTypes.DATE
            }
        });
    },

    down: (queryInterface) => {
        return queryInterface.dropTable(TABLE_NAME);
    }
};
