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
    userController.verifyDoctor,
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

router.post(
    "/doctor-qualification-registration/:userId",
    userController.doctorQualificationRegister
);

router.get(
    "/doctor-qualification-registration/:userId",
    userController.getDoctorQualificationRegisterData,
);

router.post(
    "/delete-qualification-document/:qualificationId",
    userController.deleteDoctorQualificationDocument,
);

router.post(
    "/register-qualification/:userId",
    userController.registerQualification
);

router.post(
    "/upload-qualification-document/:userId",
    upload.single("files"),
    userController.uploadDoctorQualificationDocument
);

router.post(
    "/doctor-clinic-registration/:userId",
    userController.doctorClinicRegister
);
router.post("/sign-out", Authenticate, userController.signOut);

module.exports = router;
