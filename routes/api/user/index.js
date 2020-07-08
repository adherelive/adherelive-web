const express = require("express");
const router = express.Router();
// const userController = require("../../../app/controllers/user/user.controller");
import Authenticate from "../middleware/auth";
import userController from "../../../app/controllers/user/user.controller";
const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ dest: "../../../app/public/", storage: storage });

router.get(
    "/register/:link",
    userController.verifyUser,
);


router.post(
    "/sign-in",
    userController.signIn,
);

router.post(
    "/sign-up",
    userController.signUp,
);

router.get(
    "/get-basic-info",
    Authenticate,
    userController.onAppStart,
);

router.post(
    "/add-patient/:userId",
    userController.addDoctorsPatient,
);

router.post(
    "/googleSignIn",
    userController.signInGoogle
);

router.post(
    "/facebookSignIn",
    userController.signInFacebook
);

router.post(
    "/upload",
    upload.single("files"),
    userController.uploadImage
);

router.post(
    "/doctor-profile-registration",
    userController.doctorProfileRegister
);

router.get(
    "/doctor-profile-registration/:userId",
    userController.getDoctorProfileRegisterData,
);

// REGISTRATION UPDATES IN CONTROLLER
router.post(
    "/doctor-qualification-registration/:userId",
    userController.doctorQualificationRegister
);

router.get(
    "/doctor-qualification-registration/:userId",
    userController.getDoctorQualificationRegisterData,
);

// REGISTRATION
router.get(
    "/doctor-registration",
    userController.getDoctorRegistrationData,
);

router.post(
    "/delete-qualification-document/:qualificationId",
    userController.deleteDoctorQualificationDocument,
);

// REGISTRATION
router.delete(
    "/registration-document/:registrationId",
    userController.deleteDoctorRegistrationDocument,
);

router.post(
    "/register-qualification/:userId",
    userController.registerQualification
);

// REGISTRATION
router.post(
    "/doctor-registration",
    userController.updateRegistrationDetails
);

router.post(
    "/upload-qualification-document/:userId",
    upload.single("files"),
    userController.uploadDoctorQualificationDocument
);

// REGISTRATION
router.post(
    "/registration-document",
    upload.single("files"),
    userController.uploadDoctorRegistrationDocuments
);

router.post(
    "/doctor-clinic-registration/:userId",
    userController.doctorClinicRegister
);
router.post("/sign-out", Authenticate, userController.signOut);

router.post(
    "/forgot-password",
    // validator
    userController.forgotPassword
);

router.post(
    "/verify/:link",
    // validator
    userController.verifyPasswordResetLink
);

router.post(
    "/password-reset",
    Authenticate,
    // validator
    userController.updateUserPassword
);

module.exports = router;
