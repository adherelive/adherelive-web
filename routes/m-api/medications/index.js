const express = require("express");
const router = express.Router();

import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

import Authenticate from "../middlewares/auth";
import MobileMedication from "../../../app/controllers/mControllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";

router.get(
  "/:patient_id/medication-run-rate",
  Authenticate,
  isAllowed(PERMISSIONS.MEDICATIONS.VIEW_TIMELINE),
  MobileMedication.getMedicationEventsStatus
);

router.get(
    "/:patient_id/details",
    Authenticate,
    MobileMedication.getMedicationDetails
);

// router.get(
//   "/:id",
//   // Authenticate,
//   MobileMedication.getMedicationForId
// );
router.post(
  "/",
  Authenticate,
  isAllowed(PERMISSIONS.MEDICATIONS.ADD),
  validator.validateMedicationReminderData,
  MobileMedication.createCarePlanMedication
);

router.post(
  "/:id",
  Authenticate,
  isAllowed(PERMISSIONS.MEDICATIONS.UPDATE),
  validator.validateMedicationReminderData,
  MobileMedication.update
);

router.delete("/:id", Authenticate, isAllowed(PERMISSIONS.MEDICATIONS.DELETE), MobileMedication.delete);

module.exports = router;
