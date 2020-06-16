const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import MobileMedication from "../../../app/controllers/mControllers/medicationReminder/mReminder.controller";
// import * as validator from "./validator";

router.get(
    "/:id",
    Authenticate,
    MobileMedication.getMedicationForId
);

module.exports = router;