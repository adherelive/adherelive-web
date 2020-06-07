import express from "express";
import Authenticated from "../middleware/auth";
import PatientController from "../../../app/controllers/patients/patients.controller";
import multer from "multer";
var storage = multer.memoryStorage();
var upload = multer({ dest: "../app/public/", storage: storage });

const router = express.Router();

router.post('/patient',
    Authenticated,
    upload.single("files"),
    PatientController.updatePatient
);

module.exports = router;