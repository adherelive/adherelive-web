// const express = require("express");
import express from "express";
import Authenticate from "../../m-api/middleware/auth";
import DoctorController from "../../../app/controllers/doctors/doctor.controller";
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
    "/details",
    // validator.validateDoctorQualificationData,
    // todo :: wip
    DoctorController.updateDoctorQualificationRegistration
);

router.post(
    "/qualifications",
    // validator.validateDoctorQualificationData,
    // todo :: wip
    DoctorController.updateQualificationStep
);

router.post(
    "/qualifications/docs",
    // validator.validateDoctorQualificationData,
    // todo :: wip
    upload.single("files"),
    DoctorController.updateQualificationDocs
);

router.post(
    "/registrations",
    // validator.validateDoctorQualificationData,
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
    // validator.validateDoctorQualificationData,
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

router.get(
    "/",
    // Authenticate,
    DoctorController.getAllDoctorDetails
);

module.exports = router;