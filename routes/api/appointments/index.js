const express = require("express");
const router = express.Router();

import Authenticate from "../middleware/auth";
import Appointment from "../../../app/controllers/appointments/appointment.controller";
import * as validator from "./validator";
import { isDoctor } from "../middleware/doctor";


router.get(
    "/details",
    Authenticate,
    Appointment.getAppointmentDetails
);



router.get(
    "/missed",
    Authenticate,
    isDoctor,
    Appointment.getAllMissedAppointments
)


router.get(
    "/:id",
    Authenticate,
    Appointment.getAppointmentForPatient
);

router.post(
    "/",
    Authenticate,
    validator.validateAppointmentFormData,
    Appointment.create
);

router.post(
    "/:carePlanId",
    Authenticate,
    validator.validateAppointmentFormData,
    Appointment.createCarePlanAppointment
);

router.post(
    "/update/:appointment_id",
    Authenticate,
    validator.validateAppointmentFormData,
    Appointment.update
);

router.delete(
    "/:appointment_id",
    Authenticate,
    Appointment.delete
);


module.exports = router;