import Database from "../../../libs/mysql";
import {TABLE_NAME} from "../../models/uploadDocuments";

class UploadDocumentService {
    constructor() {}

    addDocument = async data => {
        const transaction = await Database.initTransaction();
      try {
          const document = await Database.getModel(TABLE_NAME).create(data, {transaction});
          await transaction.commit();
          return document;
      } catch(error) {
          await transaction.rollback();
          throw error;
      }
    };

    getDocumentById = async id => {
        try {
            const documents = await Database.getModel(TABLE_NAME).findOne({
                where: {
                    id
                }
            });
            return documents;
        } catch(error) {
            throw error;
        }
    };

    getDoctorQualificationDocuments = async (parent_type,parent_id) => {
        try {
            const documents = await Database.getModel(TABLE_NAME).findAll({
                where: {
                    parent_type,
                    parent_id,
                    // deleted_at:null
                }
            });
            return documents;
        } catch(error) {
            throw error;
        }
    };

    getDocumentByData = async (parent_type,parent_id,document) => {
        try {
            const documents = await Database.getModel(TABLE_NAME).findOne({
                where: {
                    parent_type,
                    parent_id,
                    document,
                    deleted_at:null
                }
            });
            return documents;
        } catch(error) {
            throw error;
        }
    };

    deleteDocumentsOfQualification = async (parent_type,parent_id) => {
        try {
            const documents = await Database.getModel(TABLE_NAME).destroy({
                where: {
                    parent_type,
                    parent_id,
                    deleted_at:null
                }
            });
            return documents;
        } catch(error) {
            throw error;
        }
    };

    getDocumentByName = async (data) => {
        try {
            const document = await Database.getModel(TABLE_NAME).findOne({
                where: data
            });
            return document;
        } catch(error) {
            throw error;
        }
    };

    getAllByData = async (data) => {
        try {
            const documents = await Database.getModel(TABLE_NAME).findAll({
                where: data
            });
            return documents;
        } catch(error) {
            throw error;
        }
    };

    deleteDocumentsOfAppointment = async (id) => {
        try {
            const documents = await Database.getModel(TABLE_NAME).destroy({
                where: {
                    id
                }
            });
            return documents;
        } catch(error) {
            throw error;
        }
    };

    deleteDocumentByData = async (data) => {
        try {
            return await Database.getModel(TABLE_NAME).destroy({
                where: data
            });
        } catch(error) {
            throw error;
        }
    };

    getAll = async () => {
      try {
          return await Database.getModel(TABLE_NAME).findAll();
      } catch(error) {
          throw error;
      }
    };
   
}

export default new UploadDocumentService();