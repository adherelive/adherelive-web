import {DataTypes} from "sequelize";
import {TABLE_NAME as userTableName} from "./users";

export const TABLE_NAME = "account_details";

export const ACCOUNT_TYPES = {
    SAVINGS: "savings",
    CURRENT: "current"
};

export const db = database => {
    database.define(
        TABLE_NAME,
        {
            id: {
                type: DataTypes.INTEGER,
                primaryKey: true,
                autoIncrement: true
            },
            user_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: {
                        tableName: userTableName
                    },
                    key: "id"
                }
            },
            customer_name: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            account_number: {
                type: DataTypes.STRING,
                allowNull: false
            },
            upi_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            ifsc_code: {
                type: DataTypes.STRING,
                allowNull: false
            },
            account_type: {
                type: DataTypes.ENUM,
                values: [ACCOUNT_TYPES.SAVINGS, ACCOUNT_TYPES.CURRENT],
                allowNull: false
            },
            account_mobile_number: {
                type: DataTypes.STRING,
                allow_null: false
            },
            prefix: {
                type: DataTypes.STRING,
                allowNull: true
            },
            in_use: {
                type: DataTypes.BOOLEAN,
                defaultValue: false
            },
            razorpay_account_id: {
                type: DataTypes.STRING,
                allowNull: true
            },
            razorpay_account_name: {
                type: DataTypes.STRING,
                allowNull: true
            }
        },
        {
            underscored: true,
            paranoid: true
        }
    );
};

export const associate = database => {
    // database.models[TABLE_NAME].belongsTo(database.models[userTableName], {
    //     foreignKey:"user_id",
    //     targetKey:"id"
    // });
};
