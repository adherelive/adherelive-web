import agoraService from "../../services/agora/agora.service";
import Controller from "../";
import {
  USER_CATEGORY,
  AGORA_CALL_NOTIFICATION_TYPES,
  EVENT_STATUS,
} from "../../../constant";

import Logger from "../../../libs/log";

import AgoraJob from "../../JobSdk/Agora/observer";
import NotificationSdk from "../../NotificationSdk";

const Log = new Logger("WEB > AGORA > CONTROLLER");

class AgoraController extends Controller {
  constructor() {
    super();
  }

  generateVideoAccessToken = async (req, res) => {
    res.header("Acess-Control-Allow-Origin", "*");
    try {
      const {
        params: { id = null } = {},
        userDetails: { userRoleId, userData: { category } = {} } = {},
      } = req;

      let doctorRoleId = null,
        patientRoleId = null;
      if (category === USER_CATEGORY.DOCTOR) {
        doctorRoleId = userRoleId;
        patientRoleId = id;
      } else if (category === USER_CATEGORY.HSP) {
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
      Log.debug("generateVideoAccessToken 50 error", error);
      return this.raiseServerError(res, 500, {}, "Error in video calling.");
    }
  };

  missedCall = async (req, res) => {
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

      // let doctorUserId = null, patientUserId = null;
      // if(category === USER_CATEGORY.DOCTOR) {
      //     doctorUserId = userId;
      //     patientUserId = id;
      // } else if (category === USER_CATEGORY.PATIENT) {
      //     doctorUserId = id;
      //     patientUserId = userId;
      // }
      // const roomId = agoraService.getRoomId(doctorUserId, patientUserId);
      // const participantTwoId = category === USER_CATEGORY.DOCTOR? patientUserId: doctorUserId;

      const eventScheduleData = {
        type: AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL,
        event_id: roomId,
        event_type: AGORA_CALL_NOTIFICATION_TYPES.MISSED_CALL,
        details: {},
        roomId,
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
      Log.debug("missedCall 500 error", error);
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
      console.log("room id is ", roomId)
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
      Log.debug("startAppointment error", error);
      return this.raiseServerError(res);
    }
  };
}

export default new AgoraController();
