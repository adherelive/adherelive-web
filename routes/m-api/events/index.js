const express = require("express");
const router = express.Router();
import Authenticate from "../middlewares/auth";
import MobileAppointment from "../../../app/controllers/mControllers/appointments/appointment.controller";
import EventController from "../../../app/controllers/mControllers/scheduleEvents/event.controller";

import MobileMedicationReminder from "../../../app/controllers/mControllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";

router.post(
  "/appointments",
  Authenticate,
  validator.validateAppointmentFormData,
  MobileAppointment.create
);

// ----------- MEDICATION -----------

router.get(
  "/medication-details",
  Authenticate,
  MobileMedicationReminder.getMedicationDetails
);

router.post(
  "/medication/:patient_id",
  Authenticate,
  validator.validateMedicationReminderData,
  MobileMedicationReminder.createCarePlanMedication
);

router.get(
  "/missed",
  Authenticate,
    EventController.getAllMissedEvents
);

router.get(
    "/missed/:patient_id",
    Authenticate,
    EventController.getPatientMissedEvents
);

// VITALS

router.get("/vitals/:id", Authenticate, EventController.getVitalEvent);

// --------------- GET ALL RECENT EVENTS PATIENT DASHBOARD
router.get("/", Authenticate, EventController.getAllEvents);

// for alerts from last visit
router.get(
    "/:patient_id/last-visit",
    Authenticate,
    EventController.getLastVisitEvents
);

router.post(
  "/medication-status/:eventId",
  Authenticate,
  EventController.updateMedicationStatus
);

router.post(
    "/:id/complete",
    Authenticate,
    EventController.markEventComplete
);

router.post(
    "/:id/cancel",
    Authenticate,
    EventController.markEventCancelled
);

router.delete(
    "/:id/vitals/response",
    Authenticate,
    EventController.deleteVitalResponse
);

router.post(
    "/:id/vitals/response",
    Authenticate,
    EventController.updateVitalResponse
);

module.exports = router;
