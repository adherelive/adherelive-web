import agoraService from "../../services/agora/agora.service";
import Controller from "../";
import {
    USER_CATEGORY,
  } from "../../../constant";

import Log from "../../../libs/log_new";
Log.fileName("WEB > AGORA > CONTROLLER");

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
            Log.debug("generateVideoAccessToken 50 error", error);
            return this.raiseServerError(res, 500, {}, "Error in video calling.");
        }
    }
}

export default new AgoraController();
