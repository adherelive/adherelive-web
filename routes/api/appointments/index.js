import Authenticate from "../middleware/auth";
import Appointment from "../../../app/controllers/appointments/appointment.controller";
import * as validator from "./validator";
import { isDoctor } from "../middleware/doctor";

const express = require("express");
const router = express.Router();

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

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
  Appointment.deleteAppointmentDoc
);

/**
 * @swagger
 * /api/appointments/missed:
 *  get:
 *     tags:
 *       - Patient
 *     description: Returns all missed events, for the logged-in user
 *                  Details of missing appointments
 *     security:
 *       - Bearer: []
 *     produces:
 *       - application/json
 *     responses:
 *       200:
 *         description: An array of missed events
 * TODO: This API is not being used by the frontend, to get the missed appointments?
 *       We need to use this to ensure the data is sent, as currently the structure in the FE is from this API
 */
router.get(
  "/missed",
  Authenticate,
  isDoctor,
  Appointment.getAllMissedAppointments
);

router.get("/date", Authenticate, Appointment.getDayAppointmentByDate);

router.get("/:id", Authenticate, Appointment.getAppointmentForPatient);

router.post(
  "/",
  Authenticate,
  validator.validateAppointmentFormData,
  Appointment.create
);

router.post(
  "/:carePlanId/appointments",
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

router.delete("/:appointment_id/delete", Authenticate, Appointment.delete);

module.exports = router;
