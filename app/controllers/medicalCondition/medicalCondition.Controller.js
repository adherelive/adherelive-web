const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("medicalConditionController");
const medicalConditionService = require("../../services/medicalCondition/medicalCondition.service");
const programService = require("../../services/program/program.service");
const { NotificationSdk } = require("../../notificationSdk");
import { USER_CATEGORY, NOTIFICATION_VERB, EVENT_IS } from "../../../constant";

class MedicalConditionController {
  constructor() {}
  async editBasicCondition(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;
      const { body: data } = req;

      const { userId, userData = {} } = req.userDetails;
      const { category, programId } = userData;
      const editedBasicCondition = await medicalConditionService.updateBasicCondition(
        medicalConditionId,
        data
      );

      let participantId = "";
      if (category === USER_CATEGORY.CARE_COACH) {
        const { userId: patientId } = editedBasicCondition;
        participantId = patientId;
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
          _id: medicalConditionId,
          userId,
          eventType: NOTIFICATION_VERB.BASIC
        },
        eventIs: EVENT_IS.UPDATED
      };
      NotificationSdk.execute(participantId, notificationData);
      const medicalsData = { [medicalConditionId]: editedBasicCondition };
      response.setData({ medicalsData });
      response.setMessage("Basic details updated successfully");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async addVital(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;

      const { body: data } = req;
      const { userId, userData = {} } = req.userDetails;
      const { category, programId } = userData;
      const addedVitals = await medicalConditionService.addVitals(
        medicalConditionId,
        [data]
      );

      let participantId = "";
      if (category === USER_CATEGORY.CARE_COACH) {
        const { userId: patientId } = addedVitals;
        participantId = patientId;
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
          _id: medicalConditionId,
          userId,
          eventType: NOTIFICATION_VERB.VITALS
        },
        eventIs: EVENT_IS.UPDATED
      };
      NotificationSdk.execute(participantId, notificationData);

      const medicalsData = { [medicalConditionId]: addedVitals };
      response.setData({ medicalsData });
      response.setMessage("Vital details updated successfully");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async addClinicalReading(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;

      const { body: data } = req;

      const { userId, userData = {} } = req.userDetails;
      const { category, programId } = userData;
      const addedClinicalReading = await medicalConditionService.addClinicalReading(
        medicalConditionId,
        [data]
      );

      // removeClinicalReading

      let participantId = "";
      if (category === USER_CATEGORY.CARE_COACH) {
        const { userId: patientId } = addedClinicalReading;
        participantId = patientId;
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
          _id: medicalConditionId,
          userId,
          eventCategory: NOTIFICATION_VERB.CLINICAL_READING
        },
        eventIs: EVENT_IS.CREATED
      };
      NotificationSdk.execute(participantId, notificationData);
      const medicalsData = { [medicalConditionId]: addedClinicalReading };
      response.setData({ medicalsData });
      response.setMessage("Clinical Reading added successfully");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async removeClinicalReading(req, res) {
    let response;
    try {
      const medicalConditionId = req.params.id;

      const { userId, userData = {} } = req.userDetails;
      const { category, programId } = userData;

      const {
        body: { test }
      } = req;

      if (!test) {
        response = new Response(false, 422);
        response.setMessage("bad request");
        return res
          .status(response.getStatusCode())
          .json(response.getResponse());
      }

      const result = await medicalConditionService.removeClinicalReading(
        medicalConditionId,
        test
      );
      console.log("result==================>", result);

      let participantId = "";
      if (category === USER_CATEGORY.CARE_COACH) {
        const { userId: patientId } = result;
        participantId = patientId;
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
          _id: medicalConditionId,
          userId,
          eventCategory: NOTIFICATION_VERB.CLINICAL_READING
        },
        eventIs: EVENT_IS.DELETE
      };
      NotificationSdk.execute(participantId, notificationData);

      response = new Response(true, 200);
      response.setMessage("Clinical Reading deleted successfully");
      return res.status(response.getStatusCode()).send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      console.log("err-------------------------->", err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).send(response.getResponse());
    }
  }

  async updateClinicalReading(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;

      const { body: data } = req;

      const { userId, userData = {} } = req.userDetails;
      const { category, programId } = userData;
      const addedClinicalReading = await medicalConditionService.updateClinicalReading(
        medicalConditionId,
        [data]
      );

      let participantId = "";
      if (category === USER_CATEGORY.CARE_COACH) {
        const { userId: patientId } = addedClinicalReading;
        participantId = patientId;
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
          _id: medicalConditionId,
          userId,
          eventType: NOTIFICATION_VERB.CLINICAL_READING
        },
        eventIs: EVENT_IS.UPDATED
      };
      NotificationSdk.execute(participantId, notificationData);
      const medicalsData = { [medicalConditionId]: addedClinicalReading };
      response.setData({ medicalsData });
      response.setMessage("Clinical Reading updated successfully");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }

  async updateOthers(req, res) {
    try {
      let response = new Response(true, 200);
      let medicalConditionId = req.params.id;
      const { body: data } = req;

      const { userId, userData = {} } = req.userDetails;
      const { category, programId } = userData;
      const editedOthersFields = await medicalConditionService.updateOthers(
        medicalConditionId,
        data
      );
      // let participantId = "";
      // if (category === USER_CATEGORY.CARE_COACH) {
      //   const { userId: patientId } = editedBasicCondition;
      //   participantId = patientId;
      // } else if (category === USER_CATEGORY.PATIENT) {
      //   const patientCarecoach = await programService.getCareCoachOfUser(
      //     userId,
      //     programId[0]
      //   );
      //   const { careCoaches = [] } = patientCarecoach;
      //   const { id: careCoachId = "" } = careCoaches[0] || {};
      //   participantId = careCoachId;
      // }
      // const notificationData = {
      //   data: {
      //     _id: medicalConditionId,
      //     userId,
      //     eventType: NOTIFICATION_VERB.BASIC
      //   },
      //   eventIs: EVENT_IS.UPDATED
      // };
      // NotificationSdk.execute(participantId, notificationData);
      const medicalsData = { [medicalConditionId]: editedOthersFields };
      response.setData({ medicalsData });
      response.setMessage("You have edited the Others Section");
      res.send(response.getResponse());
    } catch (err) {
      Log.debug(err);
      let payload = {
        error: "something went wrong!",
        code: 500
      };
      let response = new Response(false, payload.code);
      response.setError(payload.error);
      return res.status(payload.code).json(response.getResponse());
    }
  }
}
module.exports = new MedicalConditionController();
