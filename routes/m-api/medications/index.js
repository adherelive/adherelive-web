const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import MobileMedication from "../../../app/controllers/mControllers/medicationReminder/mReminder.controller";
import * as validator from "./validator";

router.get(
    "/:id",
    Authenticate,
    MobileMedication.getMedicationForId
);

router.post(
    "/:id",
    Authenticate,
    validator.validateMedicationReminderData,
    MobileMedication.update
);

router.delete(
    "/:id",
    Authenticate,
    MobileMedication.delete
);

module.exports = router;