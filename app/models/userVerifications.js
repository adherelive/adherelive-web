"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, VERIFICATION_TYPE} from "../../constant";
import Users from "./users";

const UserVerifications = database.define(
    DB_TABLES.USER_VERIFICATIONS,
    {
        id: {
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
            type: Sequelize.INTEGER
        },
        user_id: {
            type: Sequelize.INTEGER,
            allowNull: false,
            references: {
              model: {
                tableName: DB_TABLES.USERS,
              },
              key: 'id'
            }
          },
          request_id: {
            type: Sequelize.STRING,
            allowNull: false,
          },
          status: {
            type: Sequelize.STRING(20)
          },
        type: {
            type: Sequelize.ENUM,
            values: [VERIFICATION_TYPE.FORGOT_PASSWORD, VERIFICATION_TYPE.SIGN_UP]
        },
    },
    {
        underscored: true,
        paranoid: true,
        getterMethods: {
            getBasicInfo() {
                return {
                    id: this.id,
                    user_id: this.user_id,
                    request_id: this.request_id,
                    status: this.status
                };
            }
        }
    }
);

UserVerifications.belongsTo(Users, {
  foreignKey:"user_id",
   targetKey:"id"
});

export default UserVerifications;
