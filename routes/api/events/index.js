const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import EventController from "../../../app/controllers/scheduleEvents/event.controller";

import Appointment from "../../../app/controllers/appointments/appointment.controller";
import MedicationReminder from "../../../app/controllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";

// router.get(
//     "/medication/:patient_id/details",
//     Authenticate,
//     MedicationReminder.getMedicationDetails
// );

/**
 * @swagger
 * /api/events/missed:
 *  get:
 *     tags:
 *       - Events
 *     description: Returns all missed events, for the logged-in user
 *                  Details of missing appointments, medication reminders, vitals, etc.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of missed events
 */
router.get("/missed", Authenticate, EventController.getAllMissedEvents);

/**
 * @swagger
 * /api/events/details:
 *   get:
 *     tags:
 *       - Events
 *     description: Returns all missed events details, for the logged-in user
 *                  Details of missing appointments, medication reminders, vitals, etc.
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of missed events details
 */
router.get("/details", Authenticate, EventController.getEventsDetails);

router.get("/count", Authenticate, EventController.getAllMissedEventsCount);

router.get(
  "/missed/:patient_id",
  Authenticate,
  EventController.getPatientMissedEvents
);

router.get("/:patient_id", Authenticate, EventController.getAllEvents);

// router.post(
//     "/medication-reminder/:patient_id",
//     Authenticate,
//     validator.validateMedicationReminderData,
//     MedicationReminder.create
// );

// router.post(
//     "/medication-reminder/:patient_id/:carePlanId",
//     Authenticate,
//     validator.validateMedicationReminderData,
//     MedicationReminder.createCarePlanMedication
// );

router.post("/:id/complete", Authenticate, EventController.markEventComplete);

router.post(
  "/:id/vitals/response",
  Authenticate,
  EventController.updateVitalResponse
);

router.delete(
  "/:id/vitals/response",
  Authenticate,
  EventController.deleteVitalResponse
);

module.exports = router;
