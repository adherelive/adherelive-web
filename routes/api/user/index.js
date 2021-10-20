const express = require("express");
const router = express.Router();
import Authenticate from "../middleware/auth";
import userController from "../../../app/controllers/user/user.controller";
import * as validator from "./validator";


const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });


router.get(
    "/register/:link",
    userController.verifyUser,
);

router.post(
    "/sign-in",
    validator.validateSignInData,
    userController.signIn,
);

router.post(
    "/consent",
    Authenticate,
    userController.giveConsent
);


router.post(
    "/sign-up",
    validator.validateCredentialsData,
    userController.signUp,
);

router.get(
    "/get-basic-info",
    Authenticate,
    userController.onAppStart,
);

// future requirement -------------------------

// router.post(
//     "/googleSignIn",
//     userController.signInGoogle
// );
//
// router.post(
//     "/facebookSignIn",
//     userController.signInFacebook
// );

router.post(
    "/upload",
    upload.single("files"),
    userController.uploadImage
);

router.post(
    "/sign-out",
    Authenticate,
    userController.signOut
);

router.post(
    "/forgot-password",
    validator.forgotPasswordForm,
    userController.forgotPassword
);

router.post(
    "/verify/:link",
    validator.verifyLinkValidation,
    userController.verifyPasswordResetLink
);

router.post(
    "/password-reset",
    Authenticate,
    validator.validateUpdatePasswordData,
    userController.updateUserPassword
);

module.exports = router;
