const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import MobileAppointment from "../../../app/controllers/mControllers/appointments/appointment.controller";
import * as validator from "./validator";

router.get(
    "/:id",
    Authenticate,
    MobileAppointment.getAppointmentForPatient
);


router.post(
    "/update/:appointment_id",
    Authenticate,
    validator.validateAppointmentFormData,
    MobileAppointment.update
);


router.post(
    "/:carePlanId",
    Authenticate,
    validator.validateAppointmentFormData,
    MobileAppointment.createCarePlanAppointment
);

router.delete(
    "/:appointment_id",
    Authenticate,
    MobileAppointment.delete
);

module.exports = router;