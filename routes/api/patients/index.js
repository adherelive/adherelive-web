import express from "express";
import Authenticated from "../middleware/auth";
import PatientController from "../../../app/controllers/patients/patients.controller";
import ServiceSubscriptionUserMapping from "../../../app/controllers/serviceSubscriptionUserMapping/serviceSubscriptionUserMapping.controller";
import multer from "multer";
import { getTime } from "../../../app/helper/timer";

var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });

const router = express.Router();
// Create Patients from HIS.
router.post("/", Authenticated, PatientController.createPatient);

// router.post("/his-patient", Authenticated, PatientController.hisCreatePatient);

router.post(
  "/create-patient",
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

router.get("/", Authenticated, PatientController.searchPatient);

// TODO: This has been removed in the recent code for merge-2
// router.get("/namesearch", Authenticated, PatientController.searchPatientByName);

router.get(
  "/pagination",
  (req, res, next) => {
    console.log("request recevide at router -start ", getTime());
    next();
  },
  Authenticated,
  (req, res, next) => {
    console.log("request recevide at router -after middleware", getTime());
    next();
  },
  PatientController.getAllPatientsPagination
);

router.get(
  "/searchpatient",
  Authenticated,
  PatientController.searchPatientForDoctor
);

router.get(
  "/servicesubplan",
  Authenticated,
  ServiceSubscriptionUserMapping.getServiceSubscriptionUserMappingAndServiceUserByPatientIdAndDoctorId
);

router.get("/:patient_id", Authenticated, PatientController.getPatientById);

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
//getPatientCarePlanSecondaryDocDetails

router.get(
  "/:id/careplan-details-sec-doc",
  Authenticated,
  PatientController.getPatientCarePlanSecondaryDocDetails
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

router.post(
  "/add-careplan-for-patient/:patient_id",
  Authenticated,
  PatientController.createNewCareplanforPatient
);

router.get(
  "/generate_prescription/:care_plan_id",
  Authenticated,
  PatientController.generatePrescription
);

router.get(
  "/servicesubplan/:patient_id",
  Authenticated,
  ServiceSubscriptionUserMapping.getServiceSubscriptionUserMappingAndServiceUserByPatientId
);

router.get(
  "/servicesubplan/doctor/:patient_id",
  Authenticated,
  ServiceSubscriptionUserMapping.getServiceSubscriptionDoctorByPatientId
);

module.exports = router;
