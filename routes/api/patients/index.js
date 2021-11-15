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

router.post(
    "/:id/consents/request",
    Authenticated,
    PatientController.patientConsentRequest
);

router.post(
    "/consents/payments",
    Authenticated,
    PatientController.acceptPaymentsTerms
);

router.post(
    "/consents/verify",
    Authenticated,
    PatientController.patientConsentVerification
);

router.get(
    "/",
    Authenticated,
    PatientController.searchPatient
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

router.get(
    "/:careplan_id/vitals",
    Authenticated,
    PatientController.getPatientVitals
);

router.get(
    "/:patient_id/reports",
    Authenticated,
    PatientController.getPatientReports
);

router.get(
    "/:patient_id/parts/symptoms",
    Authenticated,
    PatientController.getPatientPartSymptoms
);

router.get(
    "/searchpatient",
    Authenticated,
    PatientController.searchPatientForDoctor
);

router.post(
    "/add-careplan-for-patient/:patient_id",
    Authenticated,
    PatientController.createNewCareplanforPatient
)

router.get(
    "/generate_prescription/:care_plan_id",
    Authenticated,
    PatientController.generatePrescription
);

router.get(
    "/pagination",
    Authenticated,
    PatientController.getAllPatientsPagination
);
  

module.exports = router;