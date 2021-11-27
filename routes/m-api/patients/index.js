const express = require("express");
const router = express.Router();
import Authenticated from "../middlewares/auth";
import isPatient from "../middlewares/patients";
import MPatientController from "../../../app/controllers/mControllers/patients/patients.controller";
import PatientController from "../../../app/controllers/patients/patients.controller";
import DietController from "../../../app/controllers/mControllers/diet/diet.controller";

router.post("/", isPatient, Authenticated, MPatientController.mUpdatePatient);

router.post(
  "/consents/payments",
  Authenticated,
  MPatientController.acceptPaymentsTerms
);

router.post(
  "/:id/consents/request",
  Authenticated,
  MPatientController.patientConsentRequest
);

router.post(
  "/consents/verify",
  Authenticated,
  MPatientController.patientConsentVerification
);

router.get(
  "/payment-links",
  Authenticated,
  MPatientController.getAllRelatedDoctorPaymentLinks
);

router.get("/", Authenticated, MPatientController.searchPatient);

router.get(
  "/:id/appointments",
  Authenticated,
  MPatientController.getPatientAppointments
);

router.get(
  "/:id/medications",
  Authenticated,
  MPatientController.getPatientMedications
);

router.get(
  "/:id/careplan-details",
  Authenticated,
  PatientController.getPatientCarePlanDetails
);

router.get(
  "/:patient_id/symptoms",
  Authenticated,
  MPatientController.getPatientSymptoms
);

router.get(
  "/:patient_id/parts/symptoms",
  Authenticated,
  MPatientController.getPatientPartSymptoms
);

router.get(
  "/:patient_id/vitals",
  Authenticated,
  MPatientController.getPatientVitals
);

router.get(
  "/:patient_id/reports",
  Authenticated,
  MPatientController.getPatientReports
);

router.get("/diet", Authenticated, DietController.getPatientDiets);

router.get(
  "/searchpatient",
  Authenticated,
  MPatientController.searchPatientForDoctor
);

router.get(
  "/generate_prescription/:care_plan_id",
  Authenticated,
  MPatientController.generatePrescription
);

router.get("/timings", Authenticated, MPatientController.getPatientTimings);

module.exports = router;
