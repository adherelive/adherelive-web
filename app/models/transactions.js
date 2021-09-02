import { DataTypes } from "sequelize";
import { USER_CATEGORY_ARRAY } from "./users";
import { TABLE_NAME as paymentProductTableName } from "./paymentProducts";

export const TABLE_NAME = "transactions";

export const UPI = "upi";
export const CHECKOUT = "checkout";
export const TRANSACTION_MODES = [UPI, CHECKOUT];

export const STATUS = {
  PENDING: "pending",
  COMPLETED: "completed",
  STARTED: "started",
  CANCELLED: "cancelled",
  EXPIRED: "expired",
  ACCEPTED: "accepted"
};

export const TRANSACTION_STATUS = [
  STATUS.PENDING,
  STATUS.STARTED,
  STATUS.ACCEPTED,
  STATUS.COMPLETED,
  STATUS.EXPIRED,
  STATUS.CANCELLED
];

export const db = database => {
  database.define(
    TABLE_NAME,
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      transaction_id: {
        type: DataTypes.STRING,
        allowNull: false
      },
      payment_product_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: {
            tableName: paymentProductTableName
          },
          key: "id"
        }
      },
      mode: {
        type: DataTypes.ENUM,
        values: TRANSACTION_MODES
      },
      amount: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      requestor_id: {
        type: DataTypes.INTEGER
      },
      requestor_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY
      },
      payee_id: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      payee_type: {
        type: DataTypes.ENUM,
        values: USER_CATEGORY_ARRAY
      },
      transaction_response: {
        type: DataTypes.JSON
      },
      status: {
        type: DataTypes.ENUM,
        values: TRANSACTION_STATUS,
        defaultValue: STATUS.PENDING
      },
      updated_at: {
        allowNull: false,
        type: DataTypes.DATE
      }
    },
    {
      underscored: true,
      paranoid: true
    }
  );
};

export const associate = database => {
  // associations here (if any) ...
  database.models[TABLE_NAME].hasOne(database.models[paymentProductTableName], {
    foreignKey: "id",
    sourceKey: "payment_product_id"
  });
};
