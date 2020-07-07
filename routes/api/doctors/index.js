const express = require("express");
import express from "express";
import Authenticate from "../../m-api/middleware/auth";
import DoctorController from "../../../app/controllers/doctors/doctor.controller";
const router = express.Router();

router.post(
    "/",
    Authenticate,
    // validator.validateAddDoctorData,
    DoctorController.addDoctor
);

router.post(
    "/:id",
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
    DoctorController.updateRegistrationDocs
);

// router.post(
//     "/registrations/:id",
//     // validator.validateDoctorQualificationData,
//     // todo :: wip
//     DoctorController.addDoctorRegistration
// );

router.post(
    "/add-patient",
    Authenticate,
    // validator.verifyAddPatientData,
    DoctorController.addPatient
);

module.exports = router;