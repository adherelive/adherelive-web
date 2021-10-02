import BaseSymptom from "../../../services/symptom";

// SERVICES
import SymptomService from "../../../services/symptom/symptom.service";

// WRAPPERS
import UserWrapper from "../user";
import DoctorWrapper from "../doctor";
import PatientWrapper from "../patient";
import CarePlanWrapper from "../carePlan";

import Logger from "../../../../libs/log";
import DocumentService from "../../../services/uploadDocuments/uploadDocuments.service";
import {ACTIVITY_TYPE, DOCUMENT_PARENT_TYPE} from "../../../../constant";
import DocumentWrapper from "../uploadDocument";

const Log = new Logger("API_WRAPPER > WEB > SYMPTOMS");

class SymptomWrapper extends BaseSymptom {
    constructor(data) {
        super(data);
    }

    getBasicInfo = () => {
        const {_data} = this;
        const {id, patient_id, care_plan_id, config, text} = _data || {};

        return {
            basic_info: {
                id,
                patient_id,
                care_plan_id
            },
            config,
            text
        };
    };

    getDateWiseInfo = async () => {
        const {getSymptomId, getUnformattedCreateDate} = this;

        const audios =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO,
                getSymptomId()
            )) || [];

        const photos =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO,
                getSymptomId()
            )) || [];

        const audioDocumentIds = audios.map(audio => audio.get("id"));
        const imageDocumentIds = photos.map(photo => photo.get("id"));

        return {
            data: {
                ...await this.getBasicInfo(),
                image_document_ids: imageDocumentIds,
                audio_document_ids: audioDocumentIds
            },
            type: ACTIVITY_TYPE.SYMPTOM,
            createdAt: getUnformattedCreateDate()
        };
    };

    getAllInfo = async () => {
        const {getBasicInfo, getSymptomId} = this;

        const audios =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO,
                getSymptomId()
            )) || [];

        const photos =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO,
                getSymptomId()
            )) || [];

        const videos =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_VIDEO,
                getSymptomId()
            )) || [];


        const audioDocumentIds = audios.map(audio => audio.get("id"));
        const imageDocumentIds = photos.map(photo => photo.get("id"));
        const videoDocumentIds = videos.map(video => video.get("id"));

        return {
            symptoms: {
                [getSymptomId()]: {
                    ...getBasicInfo(),
                    image_document_ids: imageDocumentIds,
                    audio_document_ids: audioDocumentIds,
                    video_document_ids: videoDocumentIds,
                    snapshot: ""
                }
            }
        };
    };

    getReferenceInfo = async () => {
        const {getSymptomId, _data} = this;

        const documentData = {};

        const {patient = {}, care_plan = {}} = _data || {};
        const {doctor} = care_plan || {};

        const doctors = await DoctorWrapper(doctor);
        const patients = await PatientWrapper(patient);
        const carePlans = await CarePlanWrapper(care_plan);

        const userData = {};
        const doctorUser = await UserWrapper(null, doctors.getUserId());
        const patientUser = await UserWrapper(null, patients.getUserId());

        userData[`${doctors.getUserId()}`] = doctorUser.getBasicInfo();
        userData[`${patients.getUserId()}`] = patientUser.getBasicInfo();

        const audios =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO,
                getSymptomId()
            )) || [];

        const photos =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO,
                getSymptomId()
            )) || [];

        const videos =
            (await DocumentService.getDoctorQualificationDocuments(
                DOCUMENT_PARENT_TYPE.SYMPTOM_VIDEO,
                getSymptomId()
            )) || [];


        for (const docs of [...audios, ...photos, ...videos]) {
            const doc = await DocumentWrapper(docs);
            documentData[doc.getUploadDocumentId()] = doc.getBasicInfo();
        }

        return {
            users: {
                ...userData
            },
            upload_documents: {
                ...documentData
            },
            patients: {
                [patients.getPatientId()]: patients.getBasicInfo()
            },
            doctors: {
                [doctors.getDoctorId()]: await doctors.getAllInfo()
            },
            // care_plans: {
            //   [carePlans.getCarePlanId()]: carePlans.getBasicInfo()
            // }
        };

        // Log.debug("patient", patient);
        // Log.debug("care_plan", care_plan);
        // Log.debug("doctor", doctor);
    };
}

export default async ({data = null, id = null}) => {
    if (data) {
        return new SymptomWrapper(data);
    }
    const symptom = await SymptomService.getByData({id});
    return new SymptomWrapper(symptom);
};
