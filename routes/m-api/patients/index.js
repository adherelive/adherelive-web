const express = require("express");
const router = express.Router();
import Authenticated from "../middlewares/auth";
import isPatient from "../middlewares/patients";
import PatientController from "../../../app/controllers/mControllers/patients/patients.controller";
import DietController from "../../../app/controllers/mControllers/diet/diet.controller";

router.post("/", isPatient, Authenticated, PatientController.mUpdatePatient);


router.post(
  "/consents/payments",
  Authenticated,
  PatientController.acceptPaymentsTerms
);

router.post(
  "/:id/consents/request",
  Authenticated,
  PatientController.patientConsentRequest
);

router.post(
  "/consents/verify",
  Authenticated,
  PatientController.patientConsentVerification
);

router.get(
  "/payment-links",
  Authenticated,
  PatientController.getAllRelatedDoctorPaymentLinks
);

router.get("/", Authenticated, PatientController.searchPatient);

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
  "/:patient_id/parts/symptoms",
  Authenticated,
  PatientController.getPatientPartSymptoms
);

router.get(
  "/:patient_id/vitals",
  Authenticated,
  PatientController.getPatientVitals
);

router.get(
    "/:patient_id/reports",
    Authenticated,
    PatientController.getPatientReports
);

router.get(
  "/diet",
  Authenticated,
  DietController.getPatientDiets
);

router.get(
  "/searchpatient",
  Authenticated,
  PatientController.searchPatientForDoctor
);

router.get(
  "/generate_prescription/:care_plan_id",
  Authenticated,
  PatientController.generatePrescription
);

router.get("/timings", Authenticated, PatientController.getPatientTimings);

module.exports = router;
