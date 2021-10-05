import {DataTypes} from "sequelize";

export const TABLE_NAME = "meal_template_food_item_mappings";

export const db = (database) => {
    database.define(
        TABLE_NAME,
        {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: DataTypes.INTEGER
            },
            meal_template_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            food_item_detail_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            }
        },
        {
            underscored: true,
            paranoid: true,
        }
    );
};

export const associate = (database) => {
    // const {upload_documents} = database.models || {};
    // database.models[TABLE_NAME].hasOne(database.models[mealTemplateTableName], {
    //     foreignKey: "id",
    //     sourceKey: "meal_template_id"
    // });
    // database.models[TABLE_NAME].hasOne(database.models[foodItemDetailsTableName], {
    //     foreignKey: "id",
    //     sourceKey: "food_item_detail_id"
    // });
};
