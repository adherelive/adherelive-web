import BaseUploadDocument from "../../../services/uploadDocuments";
import uploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";
import { completePath } from "../../../helper/filePath";

class MobileUploadDocumentWrapper extends BaseUploadDocument {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, parent_type, parent_id, document, name } = _data || {};
    return {
      basic_info: {
        id,
        name,
        parent_type,
        parent_id,
        document: completePath(document),
      },
    };
  };
}

export default async (data = null, id = null) => {
  if (data) {
    return new MobileUploadDocumentWrapper(data);
  }
  const doctor = await uploadDocumentService.getDocumentById({ id });
  return new MobileUploadDocumentWrapper(doctor);
};
