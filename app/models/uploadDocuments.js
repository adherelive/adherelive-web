"use strict";
import Sequelize from "sequelize";
import {database} from "../../libs/mysql";
import {DB_TABLES, USER_CATEGORY, SIGN_IN_CATEGORY, GENDER} from "../../constant";
import Doctors from "./doctors";

const UploadDocuments = database.define(
    DB_TABLES.UPLOAD_DOCUMENTS,
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      parent_type: {
        type: Sequelize.STRING(200),
        allowNull: false,
      },
      parent_id:{
        allowNull: false,
        type: Sequelize.INTEGER
      },
      document: {
        type: Sequelize.STRING(1000),
        allowNull: false,
      },
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
                    document: this.document,
                   
                };
            }
        }
    }
);


export default UploadDocuments;
