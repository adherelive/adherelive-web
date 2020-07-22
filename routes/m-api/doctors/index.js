import userController from "../../../app/controllers/user/user.controller";

const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import * as validator from "./validator";
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

import mDoctorController from "../../../app/controllers/mControllers/doctors/doctor.controller";

router.post(
  "/",
  Authenticate,
  validator.validateUpdateDoctorData,
    // todo :: wip
    mDoctorController.updateDoctor
);

router.post(
    "/details",
    Authenticate,
    // validator.validateDoctorQualificationData,
    // todo :: wip
    mDoctorController.updateDoctorQualificationRegistration
);

router.post(
    "/upload",
    Authenticate,
    upload.single("files"),
    mDoctorController.uploadImage
);

router.post(
    "/qualifications",
    Authenticate,
    // validator.validateDoctorQualificationData,
    // todo :: wip
    mDoctorController.updateQualificationStep
);

router.post(
    "/qualifications/docs",
    Authenticate,
    // validator.validateDoctorQualificationData,
    // todo :: wip
    upload.single("files"),
    mDoctorController.updateQualificationDocs
);

router.post(
    "/registrations",
    Authenticate,
    // validator.validateDoctorQualificationData,
    // todo :: wip
    mDoctorController.updateRegistrationStep
);

router.post(
    "/registrations/docs",
    Authenticate,
    // validator.validateDoctorQualificationData,
    // todo :: wip
    upload.single("files"),
    mDoctorController.updateRegistrationDocs
);

router.post(
    "/clinics",
    Authenticate,
    // validator.validateDoctorQualificationData,
    // todo :: wip
    mDoctorController.updateDoctorClinics
);

router.delete(
    "/qualification-documents/:id",
    Authenticate,
    mDoctorController.deleteQualificationDocument
);

router.delete(
    "/registration-documents/:id",
    Authenticate,
    mDoctorController.deleteRegistrationDocument
);

router.post(
    "/patients",
    Authenticate,
    // validator.verifyAddPatientData,
    // todo :: wip
    mDoctorController.addPatient
);

router.get(
    "/",
    Authenticate,
    mDoctorController.getAllDoctorDetails
);

module.exports = router;