import {body, check, param} from "express-validator";

const express = require("express");
const router = express.Router();
import mUserController from "../../../app/controllers/mControllers/user/user.controller";
import * as validator from "./validator";
import Authenticate from "../middleware/auth";
const multer = require("multer");
var storage = multer.memoryStorage();
var upload = multer({ dest: "../../../app/public/", storage: storage });

const PASSWORD_LENGTH = 8;

router.post(
    "/sign-in",
    validator.validateSignInData,
    mUserController.signIn,
);

router.post(
    "/verify-otp",
    validator.validateOtpData,
    mUserController.verifyOtp
);

router.post(
    "/doctors/sign-in",
    validator.validateDoctorSignInData,
    mUserController.doctorSignIn
)

router.post(
    "/sign-up",
    validator.validateCredentialsData,
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
    [
        check("email")
            .isEmail()
            .withMessage("Email is not valid"),
    ],
    mUserController.forgotPassword
);

router.post(
    "/verify-password/:link",
    [
        param("link")
            .isUUID()
    ],
    mUserController.verifyPasswordResetLink
);

router.post(
    "/verify/:link",
    [
        param("link")
            .isUUID()
    ],
    mUserController.verifyPatientLink
);

router.post(
    "/update-password",
    Authenticate,
    validator.validateUpdatePasswordData,
    mUserController.updatePassword
);

router.post(
  "/password-reset",
  Authenticate,
    [
        check("password").isLength({ min: PASSWORD_LENGTH }),
        check("confirm_password").isLength({ min: PASSWORD_LENGTH }),
        body("password").custom((value, { req }) => {
            const regEx = new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
            );
            if (req.body.confirm_password !== value) {
                throw new Error("Passwords do not match");
            } else if (!regEx.test(value)) {
                throw new Error(
                    "Password must contain atleast 1 uppercase, lowercase, number & special character"
                );
            } else {
                return true;
            }
        }),
    ],
  mUserController.updateUserPassword
);

module.exports = router;
