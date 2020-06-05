const express = require("express");
const router = express.Router();
// import Authenticate from "../middleware/auth";
import Appointment from "../../../app/controllers/appointments/appointment.controller";
import * as validator from "./validator";

router.post(
    "/appointments",
    // Authenticate,
    validator.validateAppointmentFormData,
    Appointment.create
);

module.exports = router;