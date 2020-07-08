const express = require("express");
const router = express.Router();
import mUserController from "../../../app/controllers/mControllers/user/user.controller";
import Authenticate from "../middleware/auth";
const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ dest: "../../../app/public/", storage: storage });

router.post(
    "/sign-in",
    mUserController.signIn,

);

router.post(
    "/sign-up",
    mUserController.signUp,
);


// REMOVE_AFTER
router.post(
    "/add-patient/:userId",
    mUserController.addDoctorsPatient,
);

router.get(
    "/get-basic-info",
    Authenticate,
    mUserController.onAppStart,
);

// router.post(
//     "/googleSignIn",
//     mUserController.signInGoogle
// );

router.post(
    "/facebookSignIn",
    mUserController.signInFacebook
);

// doctor post basic
router.post(
    "/doctor-profile-registration/:userId",
    mUserController.doctorProfileRegister
);

router.get(
    "/doctor-profile-registration/:userId",
    mUserController.getDoctorProfileRegisterData,
);

// REGISTRATION UPDATES IN CONTROLLER
router.post(
    "/doctor-qualification-registration/:userId",
    mUserController.doctorQualificationRegister
);

router.get(
    "/doctor-qualification-registration/:userId",
    mUserController.getDoctorQualificationRegisterData,
);

// REGISTRATION
router.get(
    "/doctor-registration",
    Authenticate,
    mUserController.getDoctorRegistrationData,
);

router.post(
    "/delete-qualification-document/:qualificationId",
    mUserController.deleteDoctorQualificationDocument,
);

// REGISTRATION
router.delete(
    "/registration-document/:registrationId",
    mUserController.deleteDoctorRegistrationDocument,
);

router.post(
    "/register-qualification/:userId",
    mUserController.registerQualification
);

// REGISTRATION
router.post(
    "/doctor-registration",
    mUserController.updateRegistrationDetails
);

router.post(
    "/upload-qualification-document/:userId",
    upload.single("files"),
    mUserController.uploadDoctorQualificationDocument
);

// REGISTRATION
router.post(
    "/registration-document",
    upload.single("files"),
    mUserController.uploadDoctorRegistrationDocuments
);

router.post(
    "/doctor-clinic-registration/:userId",
    mUserController.doctorClinicRegister
);

router.post("/sign-out", Authenticate, mUserController.signOut);

router.post(
    "/forgot-password",
    // validator
    mUserController.forgotPassword
);

router.post(
    "/verify/:link",
    // validator
    mUserController.verifyPasswordResetLink
);

router.post(
  "/password-reset",
  Authenticate,
    // validator
  mUserController.updateUserPassword
);

module.exports = router;
