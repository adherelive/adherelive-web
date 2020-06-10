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

   
}

export default new UploadDocumentService();