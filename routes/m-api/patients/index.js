import multer from "multer";

const express = require("express");
const router = express.Router();
import Authenticated from "../middleware/auth";
import PatientController from "../../../app/controllers/mControllers/patients/patients.controller";
var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });

router.post('/',
    // upload.single("profile_pic"),
    PatientController.mUpdatePatient
);

router.get(
    "/:id/appointments",
    Authenticated,
    PatientController.getPatientAppointments
);

router.get(
    "/:id/medications",
    Authenticated,
    PatientController.getPatientMedications
);

router.get(
    "/:id/careplan-details",
    Authenticated,
    PatientController.getPatientCarePlanDetails
);

router.get(
  "/:patient_id/symptoms",
  Authenticated,
  PatientController.getPatientSymptoms
);

module.exports = router;