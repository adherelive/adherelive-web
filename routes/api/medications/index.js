const express = require("express");
const router = express.Router();
import { isDoctor } from "../middleware/doctor";

import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

import Authenticate from "../middleware/auth";
import Medication from "../../../app/controllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";

// router.get(
//     "/missed",
//     Authenticate,
//     isDoctor,
//     Medication.getAllMissedMedications
// );

router.get(
  "/:id",
  Authenticate,
  isAllowed(PERMISSIONS.MEDICATIONS.VIEW),
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
  isAllowed(PERMISSIONS.MEDICATIONS.ADD),
  validator.validateMedicationReminderData,
  Medication.createCarePlanMedication
);

router.post(
  "/:id",
  Authenticate,
  isAllowed(PERMISSIONS.MEDICATIONS.UPDATE),
  validator.validateMedicationReminderData,
  Medication.update
);

router.delete(
  "/:id",
  Authenticate,
  isAllowed(PERMISSIONS.MEDICATIONS.DELETE),
  Medication.delete
);

router.get(
  "/:id/timeline",
  Authenticate,
  isAllowed(PERMISSIONS.MEDICATIONS.VIEW_TIMELINE),
  Medication.getMedicationResponseTimeline
);

module.exports = router;
