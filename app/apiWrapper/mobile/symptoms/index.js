import BaseSymptom from "../../../services/symptom";

// Services
import SymptomService from "../../../services/symptom/symptom.service";
import DocumentService from "../../../services/uploadDocuments/uploadDocuments.service";

// Wrappers
import UserWrapper from "../user";
import DoctorWrapper from "../doctor";
import PatientWrapper from "../patient";
import DocumentWrapper from "../uploadDocument";

import { ACTIVITY_TYPE, DOCUMENT_PARENT_TYPE } from "../../../../constant";

import { createLogger } from "../../../../libs/log";

const logger = createLogger("API_WRAPPER > WEB > SYMPTOMS");

class SymptomWrapper extends BaseSymptom {
  constructor(data) {
    super(data);
  }

  getBasicInfo = () => {
    const { _data } = this;
    const { id, patient_id, care_plan_id, config, text } = _data || {};

    return {
      basic_info: {
        id,
        patient_id,
        care_plan_id,
      },
      config,
      text,
    };
  };

  getDateWiseInfo = async () => {
    const { getSymptomId, getUnformattedCreateDate } = this;

    const symptomFiles =
      (await DocumentService.getAllByData({
        parent_id: getSymptomId(),
      })) || [];

    const audioDocumentIds = [];
    const imageDocumentIds = [];
    const videoDocumentIds = [];

    if (symptomFiles.length > 0) {
      for (const file of symptomFiles) {
        const document = await DocumentWrapper(file);
        switch (document.getParentType()) {
          case DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO:
            audioDocumentIds.push(document.getUploadDocumentId());
            break;
          case DOCUMENT_PARENT_TYPE.SYMPTOM_VIDEO:
            videoDocumentIds.push(document.getUploadDocumentId());
            break;
          case DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO:
            imageDocumentIds.push(document.getUploadDocumentId());
            break;
          default:
            break;
        }
      }
    }

    return {
      data: {
        ...(await this.getBasicInfo()),
        image_document_ids: imageDocumentIds,
        audio_document_ids: audioDocumentIds,
        video_document_ids: videoDocumentIds,
      },
      type: ACTIVITY_TYPE.SYMPTOM,
      createdAt: getUnformattedCreateDate(),
    };
  };

  getAllInfo = async () => {
    const { getBasicInfo, getSymptomId } = this;

    const symptomFiles =
      (await DocumentService.getAllByData({
        parent_id: getSymptomId(),
      })) || [];

    const audioDocumentIds = [];
    const imageDocumentIds = [];
    const videoDocumentIds = [];

    if (symptomFiles.length > 0) {
      for (const file of symptomFiles) {
        const document = await DocumentWrapper(file);
        switch (document.getParentType()) {
          case DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO:
            audioDocumentIds.push(document.getUploadDocumentId());
            break;
          case DOCUMENT_PARENT_TYPE.SYMPTOM_VIDEO:
            videoDocumentIds.push(document.getUploadDocumentId());
            break;
          case DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO:
            imageDocumentIds.push(document.getUploadDocumentId());
            break;
          default:
            break;
        }
      }
    }

    return {
      symptoms: {
        [getSymptomId()]: {
          ...getBasicInfo(),
          image_document_ids: imageDocumentIds,
          audio_document_ids: audioDocumentIds,
          video_document_ids: videoDocumentIds,
          snapshot: "",
        },
      },
    };
  };

  getReferenceInfo = async () => {
    const { getSymptomId, _data } = this;

    const documentData = {};

    const { patient = {}, care_plan = {} } = _data || {};
    const { doctor } = care_plan || {};

    const doctors = await DoctorWrapper(doctor);
    const patients = await PatientWrapper(patient);
    // const carePlans = await CarePlanWrapper(care_plan);

    const userData = {};
    const doctorUser = await UserWrapper(null, doctors.getUserId());
    const patientUser = await UserWrapper(null, patients.getUserId());

    userData[`${doctors.getUserId()}`] = doctorUser.getBasicInfo();
    userData[`${patients.getUserId()}`] = patientUser.getBasicInfo();

    const symptomFiles =
      (await DocumentService.getAllByData({
        parent_id: getSymptomId(),
      })) || [];

    if (symptomFiles.length > 0) {
      for (const docs of symptomFiles) {
        const doc = await DocumentWrapper(docs);
        documentData[doc.getUploadDocumentId()] = doc.getBasicInfo();
      }
    }

    return {
      users: {
        ...userData,
      },
      upload_documents: {
        ...documentData,
      },
      patients: {
        [patients.getPatientId()]: patients.getBasicInfo(),
      },
      doctors: {
        [doctors.getDoctorId()]: doctors.getBasicInfo(),
      },
      // care_plans: {
      //     [carePlans.getCarePlanId()]: carePlans.getBasicInfo()
      // }
    };

    // logger.debug("patient", patient);
    // logger.debug("care_plan", care_plan);
    // logger.debug("doctor", doctor);
  };
}

export default async ({ data = null, id = null }) => {
  if (data) {
    return new SymptomWrapper(data);
  }
  const symptom = await SymptomService.getByData({ id });
  return new SymptomWrapper(symptom);
};
