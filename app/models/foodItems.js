import {DataTypes} from "sequelize";
import {TABLE_NAME as foodItemDetailsTableName} from "./foodItemDetails";

import {USER_CATEGORY_ARRAY} from "./users";

export const TABLE_NAME = "food_items";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            creator_id: {
                type: DataTypes.INTEGER,
            },
            creator_type: {
                type: DataTypes.ENUM,
                values: USER_CATEGORY_ARRAY
            },
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {upload_documents} = database.models || {};

    // associations here (if any) ...

    database.models[TABLE_NAME].hasMany(
        database.models[foodItemDetailsTableName],
        {
            foreignKey: "food_item_id",
            sourceKey: "id",
        }
    );
};
