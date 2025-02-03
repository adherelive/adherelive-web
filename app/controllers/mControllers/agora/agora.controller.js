import agoraService from "../../../services/agora/agora.service";

import Controller from "../../index";
import {
  AGORA_CALL_NOTIFICATION_TYPES,
  EVENT_STATUS,
  USER_CATEGORY,
} from "../../../../constant";

import { createLogger } from "../../../../libs/log";

import AgoraJob from "../../../jobSdk/Agora/observer";
import NotificationSdk from "../../../notificationSdk";

// Log.setFileName("MOBILE > AGORA > CONTROLLER");
const log = createLogger("MOBILE > AGORA > CONTROLLER");

class AgoraController extends Controller {
  constructor() {
    super();
  }

  generateVideoAccessToken = async (req, res) => {
    try {
      const {
        params: { id = null } = {},
        userDetails: { userRoleId, userData: { category } = {} } = {},
      } = req;
      let doctorRoleId = null,
        patientRoleId = null;
      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        doctorRoleId = userRoleId;
        patientRoleId = id;
      } else if (category === USER_CATEGORY.PATIENT) {
        doctorRoleId = id;
        patientRoleId = userRoleId;
      }
      const channelName = agoraService.getRoomId(doctorRoleId, patientRoleId);

      const token = await agoraService.videoTokenGenerator(
        userRoleId,
        channelName
      );

      return this.raiseSuccess(
        res,
        200,
        { token: token },
        "Created new video token with userId"
      );
    } catch (error) {
      log.debug("generateVideoAccessToken 500 error", error);
      return this.raiseServerError(res, 500, {}, "Error in video calling.");
    }
  };

  missedCall = async (req, res) => {
    try {
      const {
        params: { id = null } = {},
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name } = {} } = {},
        } = {},
      } = req;

      let doctorRoleId = null,
        patientRoleId = null;
      if (category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP) {
        doctorRoleId = userRoleId;
        patientRoleId = id;
      } else if (category === USER_CATEGORY.PATIENT) {
        doctorRoleId = id;
        patientRoleId = userRoleId;
      }
      const roomId = agoraService.getRoomId(doctorRoleId, patientRoleId);
      const participantTwoId =
        category === USER_CATEGORY.DOCTOR || category === USER_CATEGORY.HSP
          ? patientRoleId
          : doctorRoleId;

      const eventScheduleData = {
        type: AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL,
        event_id: roomId,
        event_type: AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL,
        details: {},
        roomId,
        participants: [doctorRoleId, patientRoleId],
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      };

      const agoraJob = AgoraJob.execute(
        EVENT_STATUS.EXPIRED,
        eventScheduleData
      );
      await NotificationSdk.execute(agoraJob);

      return this.raiseSuccess(
        res,
        200,
        {},
        "Notification raised successfully for missed call."
      );
    } catch (error) {
      log.debug("missedCall 500 error", error);
      return this.raiseServerError(
        res,
        500,
        {},
        "Error in sending missed call notification."
      );
    }
  };

  startCall = async (req, res) => {
    try {
      const {
        body: { roomId } = {},
        userDetails: {
          userId,
          userRoleId,
          userData: { category } = {},
          userCategoryData: { basic_info: { full_name } = {} } = {},
        } = {},
      } = req;

      const agoraJob = AgoraJob.execute(EVENT_STATUS.STARTED, {
        roomId,
        event_type: AGORA_CALL_NOTIFICATION_TYPES.START_CALL,
        actor: {
          id: userId,
          user_role_id: userRoleId,
          details: { name: full_name, category },
        },
      });
      await NotificationSdk.execute(agoraJob);

      return this.raiseSuccess(
        res,
        200,
        {},
        "Calling info sent to participant"
      );
    } catch (error) {
      log.debug("startAppointment error", error);
      return this.raiseServerError(res);
    }
  };
}

export default new AgoraController();
