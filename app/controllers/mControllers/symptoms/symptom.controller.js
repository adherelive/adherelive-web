import Controller from "../../";

// SERVICES ----------
import SymptomService from "../../../services/symptom/symptom.service";
import UploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";

// WRAPPERS ----------
import SymptomWrapper from "../../../ApiWrapper/mobile/symptoms";
import DocumentWrapper from "../../../ApiWrapper/mobile/uploadDocument";
import CarePlanWrapper from "../../../ApiWrapper/mobile/carePlan";
import DoctorWrapper from "../../../ApiWrapper/mobile/doctor";
import PatientWrapper from "../../../ApiWrapper/mobile/patient";

import {uploadAudio, uploadImage} from "./symptom.controller.helper";
import Logger from "../../../../libs/log";
import {DOCUMENT_PARENT_TYPE} from "../../../../constant";
import {getFilePath} from "../../../helper/filePath";
import twilioService from "../../../services/twilio/twilio.service";

const Log = new Logger("MOBILE > SYMPTOM > CONTROLLER");

class SymptomController extends Controller {
    constructor() {
        super();
    }

    create = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            Log.debug("req body---> ", req.body);
            Log.debug("req params---> ", req.params);

            const {body, params: {patient_id} = {}, userDetails: {userId} = {}} = req;
            const {care_plan_id, duration = "", parts = [], text = "", audios = [], photos = []} = body || {};

            const symptomData = await SymptomService.create({
                patient_id,
                care_plan_id,
                config: {
                    duration,
                    parts,
                },
                text
            });

            const symptom = await SymptomWrapper(symptomData);

            const audioDocumentIds = [];
            const imageDocumentIds = [];
            const uploadDocumentData = {};

            for(const audio of audios) {
                const {name, file} = audio || {};
                const audioExists = await UploadDocumentService.getDocumentByName({
                   name,
                    parent_id: symptom.getSymptomId()
                });
                if(!audioExists) {
                    const addDocument = await UploadDocumentService.addDocument({
                        parent_type: DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO,
                        parent_id: symptom.getSymptomId(),
                        document: getFilePath(file),
                        name,
                    });
                    const document = await DocumentWrapper(addDocument);
                    uploadDocumentData[document.getUploadDocumentId()] = document.getBasicInfo();
                    audioDocumentIds.push(addDocument.get("id"));
                }
            }

            for(const photo of photos) {
                const {name, file} = photo || {};
                const audioExists = await UploadDocumentService.getDocumentByName({
                    name,
                    parent_id: symptom.getSymptomId()
                });
                if(!audioExists) {
                    const addDocument = await UploadDocumentService.addDocument({
                        parent_type: DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO,
                        parent_id: symptom.getSymptomId(),
                        document: getFilePath(file),
                        name,
                    });
                    const document = await DocumentWrapper(addDocument);
                    uploadDocumentData[document.getUploadDocumentId()] = document.getBasicInfo();
                    imageDocumentIds.push(addDocument.get("id"));
                }
            }

            const carePlan = await CarePlanWrapper(null, care_plan_id);

            const doctorId = carePlan.getDoctorId();
            const doctorData = await DoctorWrapper(null, doctorId);
            const patientData = await PatientWrapper(null, patient_id);

            const twilioMsg = await twilioService.addSymptomMessage(doctorData.getUserId(), patientData.getUserId(), "test");



            return raiseSuccess(res, 200, {
                symptoms: {
                    [symptom.getSymptomId()]: {
                        ...symptom.getBasicInfo(),
                    }
                },
                upload_documents: {
                    ...uploadDocumentData
                },
                image_document_ids: imageDocumentIds,
                audio_document_ids: audioDocumentIds,
                symptom_ids : [symptom.getSymptomId()]
            }, "Symptom added successfully");
        } catch(error) {
            Log.debug("symptom create 500 error", error);
            return raiseServerError(res);
        }
    };

    uploadAudio = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            Log.debug("req.file ----> ", req.file);

            const {userDetails: {userId} = {}} = req;

            const {file, name} = await uploadAudio({userId, file: req.file});

            return raiseSuccess(
                res,
                200,
                {
                    file,
                    name
                },
                "Symptom audio added successfully"
            );
        } catch(error) {
            Log.debug("symptom uploadAudio 500 error", error);
            return raiseServerError(res);
        }
    };

    uploadPhotos = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            Log.debug("req.file ----> ", req.file);

            const {userDetails: {userId} = {}} = req;

            const {file, name} = await uploadImage({userId, file: req.file});

            Log.info(`FILE_NAME: ${name} | FILE: ${file}`);

            return raiseSuccess(
                res,
                200,
                {
                    file,
                    name
                },
                "Symptom photo added successfully"
            );
        } catch(error) {
            Log.debug("symptoms uploadPhotos 500 error", error);
            return raiseServerError(res);
        }
    };

    getSymptomDetails = async (req, res) => {
        const {raiseSuccess, raiseServerError} = this;
        try {
            Log.debug("req.body ----> ", req.body);
            Log.debug("req.params ----> ", req.params);
            const {params: {id} = {}} = req;

            const symptomData = await SymptomWrapper({id});

            Log.debug("symptomData --> ", symptomData._data);

            return raiseSuccess(
                res,
                200,
                {},
                "Symptom details fetched successfully"
            );
        } catch(error) {
            Log.debug("symptoms getSymptomDetails 500 error", error);
            return raiseServerError(res);
        }
    };
}

export default new SymptomController();