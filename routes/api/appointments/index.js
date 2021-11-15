const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

import Authenticate from "../middleware/auth";
import Appointment from "../../../app/controllers/appointments/appointment.controller";
import * as validator from "./validator";
import { isDoctor } from "../middleware/doctor";

router.get("/details", Authenticate, Appointment.getAppointmentDetails);

router.post("/download-doc", Authenticate, Appointment.downloadAppointmentDoc);

router.post(
  "/:appointment_id/upload-doc",
  Authenticate,
  upload.single("files"),
  Appointment.uploadAppointmentDoc
);

router.delete(
  "/:document_id/delete-doc", 
  Authenticate,
  Appointment.deleteAppointmentDoc);


router.get(
  "/missed",
  Authenticate,
  isDoctor,
  Appointment.getAllMissedAppointments
);

router.get("/:id", Authenticate, Appointment.getAppointmentForPatient);

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

router.delete("/:appointment_id", Authenticate, Appointment.delete);

module.exports = router;
