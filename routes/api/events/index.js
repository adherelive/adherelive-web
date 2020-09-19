import EventController from "../../../app/controllers/scheduleEvents/event.controller";

const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Appointment from "../../../app/controllers/appointments/appointment.controller";
import MedicationReminder from "../../../app/controllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";

router.get(
    "/medication-details",
    Authenticate,
    MedicationReminder.getMedicationDetails
);

router.get(
    "/:patient_id",
    Authenticate,
    EventController.getAllEvents
);

router.post(
    "/medication-reminder/:patient_id",
    Authenticate,
    validator.validateMedicationReminderData,
    MedicationReminder.create
);

router.post(
    "/medication-reminder/:patient_id/:carePlanId",
    Authenticate,
    validator.validateMedicationReminderData,
    MedicationReminder.createCarePlanMedication
);

module.exports = router;