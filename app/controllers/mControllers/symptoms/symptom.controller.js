import Controller from "../../index";

// Services
import SymptomService from "../../../services/symptom/symptom.service";
import UploadDocumentService from "../../../services/uploadDocuments/uploadDocuments.service";
import twilioService from "../../../services/twilio/twilio.service";

// Wrappers
import SymptomWrapper from "../../../apiWrapper/mobile/symptoms";
import DocumentWrapper from "../../../apiWrapper/mobile/uploadDocument";
import CarePlanWrapper from "../../../apiWrapper/mobile/carePlan";

import PatientWrapper from "../../../apiWrapper/mobile/patient";

import { uploadAudio, uploadImage, uploadVideo } from "./symptoms.helper";
import { createLogger } from "../../../../libs/logger";
import {
    ALLOWED_VIDEO_EXTENSIONS,
    DOCUMENT_PARENT_TYPE,
    EVENT_STATUS,
    EVENT_TYPE,
    USER_CATEGORY,
} from "../../../../constant";
import { getFilePath } from "../../../helper/s3FilePath";
import carePlanService from "../../../services/carePlan/carePlan.service";
import SymptomsJob from "../../../jobSdk/Symptoms/observer";
import NotificationSdk from "../../../notificationSdk";

const logger = createLogger("MOBILE > SYMPTOM > CONTROLLER");

class SymptomController extends Controller {
  constructor() {
    super();
  }

  create = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      logger.debug("req body---> ", req.body);
      logger.debug("req params---> ", req.params);

      const {
        body,
        params: { patient_id } = {},
        // userDetails: { userId, userRoleId } = {}
        userDetails: { userId, userRoleId, userData: { category } = {} } = {},
      } = req;
      const {
        care_plan_id,
        duration = "",
        side = "",
        parts = [],
        text = "",
        audios = [],
        photos = [],
        videos = [],
      } = body || {};

      const patientData = await PatientWrapper(null, patient_id);

      const symptomData = await SymptomService.create({
        patient_id,
        care_plan_id,
        config: {
          duration,
          parts,
          side,
        },
        text,
      });

      const symptom = await SymptomWrapper(symptomData);

      const audioDocumentIds = [];
      const imageDocumentIds = [];
      const uploadDocumentData = {};

      for (const audio of audios) {
        const { name, file } = audio || {};
        const audioExists = await UploadDocumentService.getDocumentByName({
          name,
          parent_id: symptom.getSymptomId(),
        });
        if (!audioExists) {
          const addDocument = await UploadDocumentService.addDocument({
            parent_type: DOCUMENT_PARENT_TYPE.SYMPTOM_AUDIO,
            parent_id: symptom.getSymptomId(),
            document: getFilePath(file),
            name,
          });
          const document = await DocumentWrapper(addDocument);
          uploadDocumentData[document.getUploadDocumentId()] =
            document.getBasicInfo();
          audioDocumentIds.push(addDocument.get("id"));
        }
      }

      for (const photo of photos) {
        const { name, file } = photo || {};
        const audioExists = await UploadDocumentService.getDocumentByName({
          name,
          parent_id: symptom.getSymptomId(),
        });
        if (!audioExists) {
          const addDocument = await UploadDocumentService.addDocument({
            parent_type: DOCUMENT_PARENT_TYPE.SYMPTOM_PHOTO,
            parent_id: symptom.getSymptomId(),
            document: getFilePath(file),
            name,
          });
          const document = await DocumentWrapper(addDocument);
          uploadDocumentData[document.getUploadDocumentId()] =
            document.getBasicInfo();
          imageDocumentIds.push(addDocument.get("id"));
        }
      }

      for (const video of videos) {
        const { name, file } = video || {};
        const videoExists = await UploadDocumentService.getDocumentByName({
          name,
          parent_id: symptom.getSymptomId(),
        });
        if (!videoExists) {
          const addDocument = await UploadDocumentService.addDocument({
            parent_type: DOCUMENT_PARENT_TYPE.SYMPTOM_VIDEO,
            parent_id: symptom.getSymptomId(),
            document: getFilePath(file),
            name,
          });
          const document = await DocumentWrapper(addDocument);
          uploadDocumentData[document.getUploadDocumentId()] =
            document.getBasicInfo();
        }
      }

      const carePlans = await carePlanService.getMultipleCarePlanByData({
        expired_on: null,
        patient_id,
      });

      let allUniqueDoctorsToNotifyData = {};

      let alluniqueChatChannelData = {};
      let doctorLatestCareplanData = {};

      for (const carePlanData of carePlans) {
        const carePlan = await CarePlanWrapper(carePlanData);
        // const doctorId = carePlan.getDoctorId();
        const doctorRoleId = carePlan.getUserRoleId();
        const secondaryDoctorRoleIds = carePlan.getCareplnSecondaryProfiles();
        // const doctorData = await DoctorWrapper(null, doctorId);

        const chatJSON = JSON.stringify({
          ...(await symptom.getAllInfo()),
          upload_documents: {
            ...uploadDocumentData,
          },
          symptom_id: symptom.getSymptomId(),
          type: EVENT_TYPE.SYMPTOMS,
        });

        // const twilioMsg = await twilioService.addSymptomMessage(
        //   doctorData.getUserId(),
        //   patientData.getUserId(),
        //   chatJSON
        // );

        // const eventData = {
        //   participants: [doctorData.getUserId(), patientData.getUserId()],
        //   actor: {
        //     id: patientData.getUserId(),
        //     details: {
        //       name: patientData.getFullName(),
        //       category: USER_CATEGORY.PATIENT
        //     }
        //   },
        //   details: {
        //     message: `A new symptom is added.`
        //   }
        // };

        // for notifications
        for (let roleId of [doctorRoleId, ...secondaryDoctorRoleIds]) {
          if (
            Object.keys(allUniqueDoctorsToNotifyData).indexOf(roleId) === -1
          ) {
            allUniqueDoctorsToNotifyData[roleId] = {
              eventData: {
                participants: [roleId, userRoleId],
                actor: {
                  id: patientData.getUserId(),
                  user_role_id: userRoleId,
                  details: {
                    name: patientData.getFullName(),
                    category: USER_CATEGORY.PATIENT,
                  },
                },
                details: {
                  message: `A new symptom is added.`,
                },
              },
              // todo: chat
              twilio: {
                channel_id: carePlan.getChannelId(),
                content: chatJSON,
              },
            };

            doctorLatestCareplanData[doctorRoleId] = carePlan.getCarePlanId();
          }
        }

        // for chat message
        if (
          Object.keys(alluniqueChatChannelData).indexOf(
            carePlan.getChannelId()
          ) === -1
        ) {
          alluniqueChatChannelData[carePlan.getChannelId()] = {
            // todo: chat
            content: chatJSON,
          };
        }

        // const chatJob = ChatJob.execute(
        //   MESSAGE_TYPES.USER_MESSAGE,
        //   eventData
        // );
        // await notificationSdk.execute(chatJob);
      }

      if (Object.keys(allUniqueDoctorsToNotifyData).length > 0) {
        const allDoctorIds = Object.keys(allUniqueDoctorsToNotifyData).map(
          (id) => {
            return parseInt(id, 10);
          }
        );

        const symptomNotificationData = {
          participants: [userRoleId, ...allDoctorIds],
          actor: {
            id: userId,
            user_role_id: userRoleId,
            details: { name: patientData.getFullName(), category },
          },
          patient_id,
          care_plan_id_data: doctorLatestCareplanData,
          event_id: symptom.getSymptomId(),
        };

        const symptomJob = SymptomsJob.execute(
          EVENT_STATUS.SCHEDULED,
          symptomNotificationData
        );
        await NotificationSdk.execute(symptomJob);

        for (const chatChannel in alluniqueChatChannelData) {
          // const chatJob = ChatJob.execute(
          //   MESSAGE_TYPES.USER_MESSAGE,
          //   allUniqueDoctorsToNotifyData[doctorId].eventData
          // );
          // await notificationSdk.execute(chatJob);

          // twilio
          const { content } = alluniqueChatChannelData[chatChannel] || {};

          await twilioService.addSymptomMessage(chatChannel, content);
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          ...(await symptom.getAllInfo()),
          ...(await symptom.getReferenceInfo()),
          symptom_ids: [symptom.getSymptomId()],
        },
        "Symptom added successfully"
      );
    } catch (error) {
      logger.error("create 500 error - symptom added", error);
      return raiseServerError(res);
    }
  };

  uploadAudio = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      logger.debug("uploadAudio req.file ---> ", req.file);

      const { userDetails: { userId } = {} } = req;

      const { file, name } = await uploadAudio({ userId, file: req.file });

      return raiseSuccess(
        res,
        200,
        {
          file,
          name,
        },
        "Symptom audio added successfully"
      );
    } catch (error) {
      logger.error("symptom uploadAudio 500 error", error);
      return raiseServerError(res);
    }
  };

  uploadVideo = async (req, res) => {
    const { raiseSuccess, raiseClientError, raiseServerError } = this;
    try {
      logger.debug("uploadVideo req.file ---> ", req.file);

      const {
        file: videoFile,
        userDetails: { userId, userData: { category } = {} } = {},
      } = req;

      if (category === USER_CATEGORY.PATIENT) {
        const fullFileName = videoFile.originalname.replace(/\s+/g, "");
        const fileExt = fullFileName.substring(
          fullFileName.length - 3,
          fullFileName.length
        );
        logger.debug(`fileExt : ${fileExt}`);
        if (ALLOWED_VIDEO_EXTENSIONS.includes(fileExt)) {
          const { file, name } = await uploadVideo({ userId, file: videoFile });

          return raiseSuccess(
            res,
            200,
            {
              file,
              name,
            },
            "Symptom video added successfully"
          );
        } else {
          return raiseClientError(
            res,
            422,
            {},
            `${fileExt.toUpperCase()} type not supported`
          );
        }
      } else {
        return raiseClientError(
          res,
          422,
          {},
          "Only patients can upload video of symptom"
        );
      }
    } catch (error) {
      logger.error("symptom uploadVideo 500 error", error);
      return raiseServerError(res);
    }
  };

  uploadPhotos = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      logger.debug("uploadPhotos req.file ---> ", req.file);

      const { userDetails: { userId } = {} } = req;

      const { file, name } = await uploadImage({ userId, file: req.file });

      logger.debug(`FILE_NAME: ${name} | FILE: ${file}`);

      return raiseSuccess(
        res,
        200,
        {
          file,
          name,
        },
        "Symptom photo added successfully"
      );
    } catch (error) {
      logger.error("symptoms uploadPhotos 500 error", error);
      return raiseServerError(res);
    }
  };

  getSymptomDetails = async (req, res) => {
    const { raiseSuccess, raiseServerError } = this;
    try {
      logger.debug("getSymptomDetails req.body ---> ", req.body);
      const { body: { symptom_ids = [] } = {} } = req;

      let documentData = {};
      let symptomData = {};
      let userData = {};
      let patientData = {};
      let doctorData = {};

      for (const id of symptom_ids) {
        const symptomExists = await SymptomService.getByData({ id });

        if (symptomExists) {
          const symptom = await SymptomWrapper({ data: symptomExists });
          const { symptoms } = await symptom.getAllInfo();
          const { users, upload_documents, patients, doctors } =
            await symptom.getReferenceInfo();
          symptomData = { ...symptomData, ...symptoms };
          userData = { ...userData, ...users };
          documentData = { ...documentData, ...upload_documents };
          patientData = { ...patientData, ...patients };
          doctorData = { ...doctorData, ...doctors };
        }
      }

      return raiseSuccess(
        res,
        200,
        {
          symptoms: {
            ...symptomData,
          },
          upload_documents: {
            ...documentData,
          },
          users: {
            ...userData,
          },
          doctors: {
            ...doctorData,
          },
          patients: {
            ...patientData,
          },
        },
        "Symptom details fetched successfully"
      );
    } catch (error) {
      logger.error("symptoms getSymptomDetails 500 error", error);
      return raiseServerError(res);
    }
  };
}

export default new SymptomController();
