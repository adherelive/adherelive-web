import Medication from "../../../app/controllers/medicationReminder/mReminder.controller";

const express = require("express");
const router = express.Router();

import Authenticate from "../middlewares/auth";
import MobileMedication from "../../../app/controllers/mControllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";

router.get(
  "/:patient_id/medication-run-rate",
  Authenticate,
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
  "/:id",
  Authenticate,
  validator.validateMedicationReminderData,
  MobileMedication.update
);

router.delete("/:id", Authenticate, MobileMedication.delete);

module.exports = router;
