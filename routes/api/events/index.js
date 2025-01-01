const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import EventController from "../../../app/controllers/scheduleEvents/event.controller";

// router.get(
//     "/medication/:patient_id/details",
//     Authenticate,
//     MedicationReminder.getMedicationDetails
// );

router.get("/missed", Authenticate, EventController.getAllMissedEvents);

// will sending the query like missed apppointment and all...
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
