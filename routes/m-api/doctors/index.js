// import userController from "../../../app/controllers/user/user.controller";
const express = require("express");
const router = express.Router();
import Authenticate from "../middlewares/auth";
import * as validator from "./validator";

import isAllowed from "../../middlewares/permissions";
import PERMISSIONS from "../../../config/permissions";

import mDoctorController from "../../../app/controllers/mControllers/doctors/doctor.controller";
import {isDoctor} from "../middlewares/doctor";
import PaymentController from "../../../app/controllers/mControllers/payments/payment.controller";
import CarePlanTemplate from "../../../app/controllers/carePlanTemplate/carePlanTemplate.controller";

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({dest: "../../../app/public/", storage: storage});

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

router.get("/search-name", Authenticate, mDoctorController.searchDoctorName);

router.get(
    "/patients",
    Authenticate,
    mDoctorController.getPaginatedDataForPatients
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

router.post(
    "/patients",
    Authenticate,
    validator.validateAddPatientData,
    // todo :: wip
    mDoctorController.addPatient
);

router.post(
    "/watchlist/:patient_id",
    Authenticate,
    mDoctorController.addPatientToWatchlist
);

router.post(
    "/consultations",
    Authenticate,
    isDoctor,
    // validator.validatePaymentProduct,
    PaymentController.addDoctorPaymentProduct
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

router.delete(
    "/watchlist/:patient_id",
    Authenticate,
    isDoctor,
    mDoctorController.removePatientFromWatchlist
);

router.get("/", Authenticate, mDoctorController.getAllDoctorDetails);

router.get(
    "/consultations",
    Authenticate,
    isDoctor,
    PaymentController.getAllDoctorPaymentProduct
);

router.delete(
    "/consultations/:id",
    Authenticate,
    isDoctor,
    PaymentController.deleteDoctorPaymentProduct
);

router.get(
    "/consultations/default",
    Authenticate,
    PaymentController.getAllAdminPaymentProduct
);

router.post(
    "/updatePatient_careplan/:careplan_id",
    Authenticate,
    validator.validateAddPatientData,
    mDoctorController.updatePatientAndCareplan
);

router.get(
    "/treatment/templates",
    Authenticate,
    CarePlanTemplate.getAllForDoctor
);

// router.post(
//   "/profile",
//   Authenticate,
//   isAllowed(PERMISSIONS.DOCTORS.ADD_PROFILE),
//   mDoctorController.addProfile
// );

module.exports = router;
