const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Appointment from "../../../app/controllers/appointments/appointment.controller";
import * as validator from "./validator";

router.get(
    "/patients/:patient_id",
    Authenticate,
    Appointment.getAppointmentForPatient
);

router.post(
    "/",
    Authenticate,
    validator.validateAppointmentFormData,
    Appointment.create
);

module.exports = router;