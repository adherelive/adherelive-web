import uploadDocumentsModel from "../../models/uploadDocuments";

class UploadDocumentService {
    constructor() {}

    addDocument = async data => {
      try {
        
          const document = await uploadDocumentsModel.create(data);
          return document;
      } catch(error) {
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

   
}

export default new UploadDocumentService();