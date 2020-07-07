import multer from "multer";

const express = require("express");
const router = express.Router();
import Authenticated from "../middleware/auth";
import PatientController from "../../../app/controllers/mControllers/patients/patients.controller";
var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });

router.post('/',
    // upload.single("profile_pic"),
    PatientController.mUpdatePatient
);

router.get(
    "/:id/appointments",
    Authenticated,
    PatientController.getPatientAppointments
);

module.exports = router;