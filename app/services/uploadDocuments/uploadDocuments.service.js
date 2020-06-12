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

   
}

export default new UploadDocumentService();