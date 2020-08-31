import Controller from "../";
import Logger from "../../../libs/log";

// SERVICES
import DocumentService from "../../services/uploadDocuments/uploadDocuments.service";

// WRAPPERS
import SymptomWrapper from "../../ApiWrapper/web/symptoms";
import DocumentWrapper from "../../ApiWrapper/web/uploadDocument";

import {DOCUMENT_PARENT_TYPE} from "../../../constant";

const Log = new Logger("WEB > CONTROLLERS > SYMPTOMS");

class SymptomController extends Controller {
    constructor() {
        super();
    }

    getSymptomDetails = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            Log.debug("req.params ----> ", req.params);
            const {params: {id} = {}} = req;

            const documentData = {};

            const symptomData = await SymptomWrapper({id});

            const audios = await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO,
                symptomData.getSymptomId()
            ) || [];

            const photos = await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO,
                symptomData.getSymptomId()
            ) || [];

            const audioDocumentIds = audios.map(audio => audio.get("id"));
            const imageDocumentIds = photos.map(photo => photo.get("id"));

            for(const docs of [...audios, ...photos]) {
                const doc = await DocumentWrapper(docs);
                documentData[doc.getUploadDocumentId()] = doc.getBasicInfo();
            }

            return raiseSuccess(
                res,
                200,
                {
                    ...await symptomData.getReferenceInfo(),
                    upload_documents: {
                        ...documentData
                    },
                    snapshot: "",
                    image_document_ids: imageDocumentIds,
                    audio_document_ids: audioDocumentIds,
                },
                "Symptom details fetched successfully"
            );
        } catch(error) {
            Log.debug("symptoms getSymptomDetails 500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new SymptomController();