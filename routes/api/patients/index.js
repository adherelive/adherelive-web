import express from "express";
import Authenticated from "../middleware/auth";
import PatientController from "../../../app/controllers/patients/patients.controller";
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });

const router = express.Router();

router.post('/patients',
    Authenticated,
    upload.single("files"),
    PatientController.updatePatient
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
)

module.exports = router;