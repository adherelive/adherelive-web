const express = require("express");
const router = express.Router();
import mUserController from "../../../app/controllers/mControllers/user/user.controller";
import * as validator from "./validator";
import Authenticate from "../middlewares/auth";
const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });

import userDeviceRouter from "../userDevice";

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
    validator.updatePasswordForm,
  mUserController.updateUserPassword
);

router.use("/devices", userDeviceRouter);

module.exports = router;
