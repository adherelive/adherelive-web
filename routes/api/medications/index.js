const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Medication from "../../../app/controllers/medicationReminder/mReminder.controller";
// import * as validator from "./validator";

router.get(
    "/:id",
    Authenticate,
    Medication.getMedicationForId
);

module.exports = router;