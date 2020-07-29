const express = require("express");
const router = express.Router();
import MobileAppointment from "../../../app/controllers/mControllers/appointments/appointment.controller";
import Authenticate from "../middleware/auth";
import * as validator from "./validator";

router.get(
    "/details",
    Authenticate,
    MobileAppointment.getAppointmentDetails
);

router.get(
    "/:patient_id",
    Authenticate,
    MobileAppointment.getAppointmentForPatient
);

router.post(
    "/",
    Authenticate,
    validator.validateAppointmentFormData,
    MobileAppointment.create
);


router.post(
    "/:id",
    Authenticate,
    validator.validateAppointmentFormData,
    MobileAppointment.update
);

router.delete(
    "/:id",
    Authenticate,
    MobileAppointment.delete
);

module.exports = router;