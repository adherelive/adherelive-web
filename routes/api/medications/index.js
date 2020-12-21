import MedicationReminder from "../../../app/controllers/medicationReminder/mReminder.controller";

const express = require("express");
const router = express.Router();
import {isDoctor} from "../middleware/doctor";


import Authenticate from "../middleware/auth";
import Medication from "../../../app/controllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";



router.get(
    "/missed",
    Authenticate,
    isDoctor,
    Medication.getAllMissedMedications
);


router.get(
    "/:id",
    Authenticate,
    Medication.getMedicationForId
);


router.get(
    "/:patient_id/details",
    Authenticate,
    Medication.getMedicationDetails
);

router.post(
    "/treatment/:patient_id/:carePlanId",
    Authenticate,
    validator.validateMedicationReminderData,
    MedicationReminder.createCarePlanMedication
);

router.post(
    "/:id",
    Authenticate,
    validator.validateMedicationReminderData,
    Medication.update
);

router.delete(
    "/:id",
    Authenticate,
    Medication.delete
);

router.get(
    "/:id/timeline",
    Authenticate,
    Medication.getMedicationResponseTimeline
);


module.exports = router;