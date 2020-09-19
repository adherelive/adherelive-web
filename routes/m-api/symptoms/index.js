import express from "express";
import multer from "multer";
import SymptomController from "../../../app/controllers/mControllers/symptoms/symptom.controller";
import Authenticate from "../middleware/auth";
import * as validator from "./validator";

const storage = multer.memoryStorage();
const upload = multer({ dest: "../../../app/public/", storage: storage });
const router  = express.Router();

router.post(
    "/",
    Authenticate,
    SymptomController.getSymptomDetails
);

router.post(
  "/audio",
  Authenticate,
    upload.single("files"),
  SymptomController.uploadAudio
);

router.post(
    "/videos",
    Authenticate,
    upload.single("files"),
    SymptomController.uploadVideo
);

router.post(
    "/photo",
    Authenticate,
    upload.single("files"),
    SymptomController.uploadPhotos
);

router.post(
    "/:patient_id",
    Authenticate,
    // validator.ValidateSymptomData,
    SymptomController.create
);

export default router;