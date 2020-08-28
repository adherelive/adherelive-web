
const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import MobileAppointment from "../../../app/controllers/mControllers/appointments/appointment.controller";
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

// router.post(
//     "/medication/:patient_id",
//     Authenticate,
//     validator.validateMedicationReminderData,
//     MobileMedicationReminder.create
// );

router.post(
    "/medication/:patient_id",
    Authenticate,
    validator.validateMedicationReminderData,
    MobileMedicationReminder.createCarePlanMedication
);

module.exports = router;