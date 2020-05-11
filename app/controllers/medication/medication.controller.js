const Response = require("../../helper/responseFormat");
const Log = require("../../../libs/log")("medicationController");
const medicationService = require("../../services/medication/medication.service");
const { NotificationSdk } = require("../../notificationSdk");
import { USER_CATEGORY, NOTIFICATION_VERB, EVENT_IS } from "../../../constant";

const moment = require("moment");

class MedicationController {
  constructor() {}

  async addMedication(req, res) {
    try {
      if (req.userDetails.exists) {
        const updateAt = moment().format();

        const { body: data } = req;
        const { value, userId } = data;
        const { product_id } = value;
        const updatedValue = { ...value, updateAt: new Date() };
        let medicine = {};
        medicine[product_id] = updatedValue;

        const lastMedication = await medicationService.getMedications({
          userId: userId
        });

        const lastMedicationLength = lastMedication.length;

        const medicinesArrayLength =
          lastMedicationLength > 0 ? lastMedication[0].medicine.length : 0;

        const lastMedicines =
          lastMedicationLength > 0 ? lastMedication[0].medicine : {};
        const prevMedication =
          lastMedicationLength > 0
            ? lastMedication[0].medicine[medicinesArrayLength - 1]
            : {};

        const newMedicines = Object.assign(prevMedication, medicine);
        newMedicines.updatedAt = updateAt;

        let newMedication = {};
        newMedication.userId = userId;
        newMedication.medicine = newMedicines;

        let addedMedication = {};

        let medication = {};

        const {
          userId: loggedInUser,
          userData: { category } = {}
        } = req.userDetails;

        if (lastMedication.length > 0) {
          addedMedication = await medicationService.updateMedication(
            newMedicines,
            userId
          );
          const {
            medicine,
            userId: patientId,
            _id: medicationId
          } = addedMedication;
          const latestMedicine = medicine[medicine.length - 1];
          medication.userId = patientId;
          medication.medicine = latestMedicine;

          const notificationData = {
            data: {
              _id: medicationId,
              userId: loggedInUser,
              eventCategory: NOTIFICATION_VERB.MEDICATION
            },
            eventIs: EVENT_IS.CREATED
          };
          NotificationSdk.execute(patientId, notificationData);
        } else {
          addedMedication = await medicationService.addMedication(
            newMedication
          );
          medication = addedMedication;

          const { _id: medicationId } = addedMedication;

          let participantId = "";
          if (category === USER_CATEGORY.CARE_COACH) {
            const { userId: patientId } = addedMedication;
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
              _id: medicationId,
              userId: loggedInUser,
              eventCategory: NOTIFICATION_VERB.MEDICATION
            },
            eventIs: EVENT_IS.CREATED
          };
          NotificationSdk.execute(participantId, notificationData);
        }
        const response = new Response(true, 200);
        response.setData({ medication });
        response.setMessage("New medication added successfully");
        res.send(response.getResponse());
      }
    } catch (err) {
      console.log("err medication =====================>", err);
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

  async editMedication(req, res) {
    try {
      if (req.userDetails.exists) {
        const updateAt = moment().format();

        const { body: data } = req;
        const { value, userId } = data;
        const { product_id } = value;
        const updatedValue = { ...value, updateAt: new Date() };
        let medicine = {};
        medicine[product_id] = updatedValue;

        const lastMedication = await medicationService.getMedications({
          userId: userId
        });

        const lastMedicationLength = lastMedication.length;

        const medicinesArrayLength =
          lastMedicationLength > 0 ? lastMedication[0].medicine.length : 0;

        const prevMedication =
          lastMedicationLength > 0
            ? lastMedication[0].medicine[medicinesArrayLength - 1]
            : {};

        const newMedicines = Object.assign(prevMedication, medicine);
        newMedicines.updatedAt = updateAt;

        let newMedication = {};
        newMedication.userId = userId;
        newMedication.medicine = newMedicines;

        let addedMedication = {};

        let medication = {};

        const { userId: loggedInUser } = req.userDetails;

        addedMedication = await medicationService.updateMedication(
          newMedicines,
          userId
        );
        const {
          medicine: addedMedicine,
          userId: patientId,
          _id: medicationId
        } = addedMedication;
        const latestMedicine = addedMedicine[addedMedicine.length - 1];
        medication.userId = patientId;
        medication.medicine = latestMedicine;

        const notificationData = {
          data: {
            _id: medicationId,
            userId: loggedInUser,
            eventType: NOTIFICATION_VERB.MEDICATION
          },
          eventIs: EVENT_IS.UPDATED
        };
        NotificationSdk.execute(patientId, notificationData);

        const response = new Response(true, 200);
        response.setData({ medication });
        response.setMessage("Medication updated successfully");
        res.send(response.getResponse());
      }
    } catch (err) {
      console.log("err medication =====================>", err);
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

  async removeMedicine(req, res) {
    try {
      if (req.userDetails.exists) {
        const { body: data, params } = req;
        const { productId, userId } = data;

        const {
          userId: loggedInUser,
          userData: { category } = {}
        } = req.userDetails;

        const newMedication = await medicationService.removeMedicine(
          productId,
          userId
        );

        // ("=========removeMedication lastest medication============",  lastMedication)
        // const newMedication ;

        const { _id: medicationId } = newMedication;
        let participantId = "";
        if (category === USER_CATEGORY.CARE_COACH) {
          const { userId: patientId } = newMedication;
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
            _id: medicationId,
            userId: loggedInUser,
            eventCategory: NOTIFICATION_VERB.MEDICATION
          },
          eventIs: EVENT_IS.DELETE
        };
        NotificationSdk.execute(participantId, notificationData);

        const response = new Response(true, 200);
        response.setData({ newMedication });
        response.setMessage("Medication removed successfully");
        res.send(response.getResponse());
      }
    } catch (err) {
      console.log("err=============================>", err);
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

module.exports = new MedicationController();
