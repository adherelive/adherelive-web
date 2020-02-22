const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("hospitalizationController");
const hospitalizationService = require("../../services/hospitalization/hospitalization.service");
const programService = require("../../services/program/program.service");
const { validationResult } = require("express-validator/check");
const { NotificationSdk } = require("../../notificationSdk");
import { USER_CATEGORY, NOTIFICATION_VERB, EVENT_IS } from "../../../constant";

class HospitalizationController {
  async addHospitalization(req, res) {
    try {
      let error = validationResult(req);
      if (!error.isEmpty()) {
        let response = new Response(false, 422);
        response.setError(error.mapped());
        return res.status(422).json(response.getResponse());
      }

      const {
        userData: { category, programId } = {},
        userId: loggedInUser
      } = req.userDetails;

      const {
        userId,
        hospitalId,
        admissionDate,
        dischargeDate,
        comment
      } = req.body;

      const data = { hospitalId, admissionDate, dischargeDate, comment };
      const hospitalizationData = await hospitalizationService.addHospitalization(
        userId,
        data
      );
      console.log(
        "hospitalizationData========================== :",
        hospitalizationData
      );
      const { _id: hospitalizationId } = hospitalizationData;
      let hospitalizationResponse = {};
      hospitalizationResponse[userId] = hospitalizationData.hospitalization;

      let participantId = "";
      if (category === USER_CATEGORY.CARE_COACH) {
        participantId = userId;
      } else if (category === USER_CATEGORY.PATIENT) {
        const patientCarecoach = await programService.getCareCoachOfUser(
          userId,
          programId[0]
        );
        const { careCoaches = [] } = patientCarecoach;
        const { id: careCoachId = "" } = careCoaches[0] || {};
        participantId = careCoachId;
      }
      const notificationData = {
        data: {
          _id: hospitalizationId,
          userId: loggedInUser,
          eventCategory: NOTIFICATION_VERB.HOSPITALISATION
        },
        eventIs: EVENT_IS.CREATED
      };
      NotificationSdk.execute(participantId, notificationData);

      const response = new Response(true, 200);
      response.setData({ hospitalization: hospitalizationResponse });
      response.setMessage("You have added the hospitalization");
      res.send(response.getResponse());
    } catch (error) {
      console.log("err hospitalization =====================>", error);
      Log.debug(err);
      let payload = {
        error: "Something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}

module.exports = new HospitalizationController();
