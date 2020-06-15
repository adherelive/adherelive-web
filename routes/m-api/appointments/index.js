const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import MobileAppointment from "../../../app/controllers/mControllers/appointments/appointment.controller";

router.get(
    "/:id",
    Authenticate,
    MobileAppointment.getAppointmentForPatient
);

module.exports = router;