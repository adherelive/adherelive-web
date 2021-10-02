const express = require("express");
const router = express.Router();
import MobileAppointment from "../../../app/controllers/mControllers/appointments/appointment.controller";
import Authenticate from "../middlewares/auth";
import * as validator from "./validator";

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({dest: "../../../app/public/", storage: storage});

router.get("/details", Authenticate, MobileAppointment.getAppointmentDetails);

router.get(
    "/:document_id/download-doc",
    Authenticate,
    MobileAppointment.downloadAppointmentDoc
);

router.delete(
    "/:document_id/delete-doc",
    Authenticate,
    MobileAppointment.deleteAppointmentDoc
);

router.post(
    "/:appointment_id/upload-doc",
    Authenticate,
    upload.single("files"),
    MobileAppointment.uploadAppointmentDoc
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

router.delete("/:id", Authenticate, MobileAppointment.delete);

module.exports = router;
