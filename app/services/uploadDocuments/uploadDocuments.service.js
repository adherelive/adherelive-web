import database from "../../../libs/mysql";

const {upload_documents: uploadDocumentsModel} = database.models;

class UploadDocumentService {
    constructor() {}

    addDocument = async data => {
        const transaction = await database.transaction();
      try {
          const document = await uploadDocumentsModel.create(data, {transaction});
          await transaction.commit();
          return document;
      } catch(error) {
          await transaction.rollback();
          throw error;
      }
    };

    getDocumentById = async id => {
        try {
            const documents = await uploadDocumentsModel.findOne({
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
            const documents = await uploadDocumentsModel.findAll({
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

    getDocumentByData = async (parent_type,parent_id,document) => {
        try {
            const documents = await uploadDocumentsModel.findOne({
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
            const documents = await uploadDocumentsModel.destroy({
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
            const document = await uploadDocumentsModel.findOne({
                where: data
            });
            return document;
        } catch(error) {
            throw error;
        }
    };

    getAllByData = async (data) => {
        try {
            const documents = await uploadDocumentsModel.findAll({
                where: data
            });
            return documents;
        } catch(error) {
            throw error;
        }
    };
   
}

export default new UploadDocumentService();