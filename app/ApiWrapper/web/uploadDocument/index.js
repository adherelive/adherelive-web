import BaseUploadDocument from "../../../services/uploadDocuments";
import uploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";


class UploadDocumentWrapper extends BaseUploadDocument {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {
            id,
            parent_type,
            parent_id,
            document,
        } = _data || {};
        return {
            basic_info: {
                id,
                parent_type,
                parent_id,
                document
            },
        };
    }
}

export default async (data = null, id = null) => {
    if(data) {
        return new UploadDocumentWrapper(data);
    }
    const doctor = await uploadDocumentService.getDocumentById({id});
    return new UploadDocumentWrapper(doctor);
}