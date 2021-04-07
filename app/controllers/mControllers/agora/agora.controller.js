import agoraService from "../../../services/agora/agora.service";

import Controller from "../../";
import {
    USER_CATEGORY,
    EVENT_STATUS,
    AGORA_CALL_NOTIFICATION_TYPES
} from "../../../../constant";

import Log from "../../../../libs/log_new";

import AgoraJob from "../../../JobSdk/Agora/observer";
import NotificationSdk from "../../../NotificationSdk";

Log.fileName("MOBILE > AGORA > CONTROLLER");

class AgoraController extends Controller {
    constructor() {
        super();
    }

    generateVideoAccessToken = async (req, res) => {
        try {
            const {params: {id = null} = {}, userDetails: {userId, userData: { category } = {}} = {}} = req;
            let doctorUserId = null, patientUserId = null;
            if(category === USER_CATEGORY.DOCTOR) {
                doctorUserId = userId;
                patientUserId = id;
            } else if (category === USER_CATEGORY.PATIENT) {
                doctorUserId = id;
                patientUserId = userId;
            }
            const channelName = agoraService.getRoomId(doctorUserId, patientUserId);

            const token = await agoraService.videoTokenGenerator(userId, channelName);

            return this.raiseSuccess(res, 200, { token: token}, "Created new video token with userId");
        } catch (error) {
            Log.debug("generateVideoAccessToken 500 error", error);
            return this.raiseServerError(res, 500, {}, "Error in video calling.");
        }
    }

    missedCall = async(req, res) => {
        try {
            const {params: {id = null} = {}, userDetails: {userId,
                 userData: { category } = {},
                 userCategoryData: { basic_info: { full_name } = {} } = {}} = {}} = req;

            let doctorUserId = null, patientUserId = null;
            if(category === USER_CATEGORY.DOCTOR) {
                doctorUserId = userId;
                patientUserId = id;
            } else if (category === USER_CATEGORY.PATIENT) {
                doctorUserId = id;
                patientUserId = userId;
            }
            const roomId = agoraService.getRoomId(doctorUserId, patientUserId);
            const participantTwoId = category === USER_CATEGORY.DOCTOR? patientUserId: doctorUserId;

            const eventScheduleData = {
                type: AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL,
                event_id: roomId,
                event_type: AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL,
                details: {},
                roomId,
                participants: [userId, participantTwoId],
                actor: {
                    id: userId,
                    details: { name: full_name, category }
                }
            };

            const agoraJob = AgoraJob.execute(
                EVENT_STATUS.EXPIRED,
                eventScheduleData
            );
            await NotificationSdk.execute(agoraJob);

            return this.raiseSuccess(res, 200, {}, "Notification raised successfully for missed call.");
        } catch (error) {
            Log.debug("missedCall 500 error", error);
            return this.raiseServerError(res, 500, {}, "Error in sending missed call notification.");
        }
    };

    startCall = async (req, res) => {
        try {
          const {
            body: { roomId } = {},
            userDetails: {
              userId,
              userData: { category } = {},
              userCategoryData: { basic_info: { full_name } = {} } = {}
            } = {}
          } = req;
    
          const agoraJob = AgoraJob.execute(EVENT_STATUS.STARTED, {
            roomId,
            actor: {
              id: userId,
              details: { name: full_name, category }
            }
          });
          await NotificationSdk.execute(agoraJob);
    
          return this.raiseSuccess(
            res,
            200,
            {},
            "Calling info sent to participant"
          );
        } catch (error) {
          Log.debug("startAppointment error", error);
          return this.raiseServerError(res);
        }
      };
    
}

export default new AgoraController();
