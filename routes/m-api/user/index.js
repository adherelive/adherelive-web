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

router.post(
    "/doctor-profile-registration/:userId",
    mUserController.doctorProfileRegister
);

router.get(
    "/doctor-profile-registration/:userId",
    mUserController.getDoctorProfileRegisterData,
);

router.post(
    "/doctor-qualification-registration/:userId",
    mUserController.doctorQualificationRegister
);

router.get(
    "/doctor-qualification-registration/:userId",
    mUserController.getDoctorQualificationRegisterData,
);

router.post(
    "/delete-qualification-document/:qualificationId",
    mUserController.deleteDoctorQualificationDocument,
);

router.post(
    "/register-qualification/:userId",
    mUserController.registerQualification
);

router.post(
    "/upload-qualification-document/:userId",
    upload.single("files"),
    mUserController.uploadDoctorQualificationDocument
);

router.post(
    "/doctor-clinic-registration/:userId",
    mUserController.doctorClinicRegister
);

router.post("/sign-out", Authenticate, mUserController.signOut);

module.exports = router;
