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


router.get(
    "/get-basic-info",
    Authenticate,
    mUserController.onAppStart,
);

// router.post(
//     "/googleSignIn",
//     mUserController.signInGoogle
// );

// router.post(
//     "/facebookSignIn",
//     mUserController.signInFacebook
// );

router.post("/sign-out", Authenticate, mUserController.signOut);

router.post(
    "/forgot-password",
    validator.forgotPassword,
    mUserController.forgotPassword
);

router.post(
    "/verify-password/:link",
    validator.verifyLink,
    mUserController.verifyPasswordResetLink
);

router.post(
    "/verify/:link",
    validator.verifyLink,
    mUserController.verifyPatientLink
);

router.post(
  "/password-reset",
  Authenticate,
    // [
    //     check("password").isLength({ min: PASSWORD_LENGTH }),
    //     check("confirm_password").isLength({ min: PASSWORD_LENGTH }),
    //     body("password").custom((value, { req }) => {
    //         const regEx = new RegExp(
    //             "^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])(?=.{8,})"
    //         );
    //         if (req.body.confirm_password !== value) {
    //             throw new Error("Passwords do not match");
    //         } else if (!regEx.test(value)) {
    //             throw new Error(
    //                 "Password must contain atleast 1 uppercase, lowercase, number & special character"
    //             );
    //         } else {
    //             return true;
    //         }
    //     }),
    // ],
    validator.updatePasswordForm,
  mUserController.updateUserPassword
);

module.exports = router;
