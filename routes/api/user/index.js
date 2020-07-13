const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import userController from "../../../app/controllers/user/user.controller";
import * as validator from "./validator";
import {check, body, param} from "express-validator";


const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });


const PASSWORD_LENGTH = 8;

router.get(
    "/register/:link",
    userController.verifyUser,
);


router.post(
    "/sign-in",
    [
        check("email")
            .isEmail()
            .withMessage("email is not valid"),
        check("password").isLength({ min: PASSWORD_LENGTH })
    ],
    // validator.validateCredentialsData,
    userController.signIn,
);

router.post(
    "/sign-up",
    [
        check("email")
            .isEmail()
            .withMessage("Email is not valid"),
        check("password")
            .isLength({ min: PASSWORD_LENGTH })
            .withMessage(
                `Password must be at least ${PASSWORD_LENGTH} characters long`
            ),
        body("password").custom((value, { req }) => {
            const regEx = new RegExp(
                "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
            );
            if (!regEx.test(value)) {
                throw new Error(
                    "Password must contain atleast 1 uppercase, lowercase, number & special character"
                );
            } else {
                return true;
            }
        }),
    ],
    validator.validateCredentialsData,
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


//-----------------------------------------------------------------------------------------------

router.post(
    "/forgot-password",
    [
        check("email")
            .isEmail()
            .withMessage("Email is not valid"),
    ],
    userController.forgotPassword
);

router.post(
    "/verify/:link",
    [
        param("link")
            .isUUID()
    ],
    userController.verifyPasswordResetLink
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
    userController.updateUserPassword
);

module.exports = router;
