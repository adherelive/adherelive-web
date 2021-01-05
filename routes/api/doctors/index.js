// const express = require("express");
import express from "express";
import Authenticate from "../middleware/auth";
import { isDoctor } from "../middleware/doctor";
import { isDoctorOrProvider } from "../middleware/isDoctorOrProvider";
import DoctorController from "../../../app/controllers/doctors/doctor.controller";
import PaymentController from "../../../app/controllers/payments/payment.controller";
import * as validator from "./validator";

const router = express.Router();
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

router.post(
  "/",
  Authenticate,
  validator.validateAddDoctorData,
  DoctorController.addDoctor
);

router.post(
  "/upload",
  Authenticate,
  upload.single("files"),
  DoctorController.uploadImage
);

router.post(
  "/details",
  validator.validateDoctorQualificationData,
  // todo :: wip
  DoctorController.updateDoctorQualificationRegistration
);

router.post(
  "/qualifications",
  validator.validateQualificationStepData,
  DoctorController.updateQualificationStep
);

router.post(
  "/qualifications/docs",
  // todo :: wip
  upload.single("files"),
  DoctorController.updateQualificationDocs
);

router.post(
  "/registrations",
  validator.validateRegistrationStepData,
  // todo :: wip
  DoctorController.updateRegistrationStep
);

router.post(
  "/registrations/docs",
  // validator.validateDoctorQualificationData,
  // todo :: wip
  upload.single("files"),
  DoctorController.updateRegistrationDocs
);

router.post(
  "/clinics",
  // Authenticate,
  validator.validateClinicData,
  // todo :: wip
  DoctorController.updateDoctorClinics
);

router.delete(
  "/qualification-documents/:id",
  // Authenticate,
  DoctorController.deleteQualificationDocument
);

router.delete(
  "/registration-documents/:id",
  // Authenticate,
  DoctorController.deleteRegistrationDocument
);

router.post(
  "/patients",
  // Authenticate,
  validator.validateAddPatientData,
  DoctorController.addPatient
);

router.post(
  "/watchlist/:patient_id",
  Authenticate,
  DoctorController.addPatientToWatchlist
);

router.post(
  "/consultations",
  Authenticate,
  isDoctorOrProvider,
  // validator.validatePaymentProduct,
  PaymentController.addDoctorPaymentProduct
);

router.post(
  "/updatePatient_careplan/:careplan_id",
  Authenticate,
  validator.validateAddPatientData,
  DoctorController.updatePatientAndCareplan
);

router.delete(
  "/consultations",
  Authenticate,
  isDoctorOrProvider,
  // validator.validatePaymentProduct,
  PaymentController.removeDoctorPaymentProduct
);

router.post(
  "/:id",
  Authenticate,
  // validator.validateAddDoctorData,
  DoctorController.updateDoctorDetails
);

// changes here with url and verb
router.delete(
  "/watchlist/:patient_id",
  Authenticate,
  isDoctor,
  DoctorController.removePatientFromWatchlist
);

router.get(
  "/consultations",
  Authenticate,
  isDoctorOrProvider,
  PaymentController.getAllDoctorPaymentProduct
);

router.get(
  "/consultations/default",
  Authenticate,
  PaymentController.getAllAdminPaymentProduct
);

router.get("/:doctor_id", Authenticate, DoctorController.getAllDoctorDetails);

module.exports = router;
