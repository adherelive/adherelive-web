// const express = require("express");
import express from "express";
import Authenticate from "../middleware/auth";
import { isDoctor } from "../middleware/doctor";
import DoctorController from "../../../app/controllers/doctors/doctor.controller";
import FeaturesController from "../../../app/controllers/features/features.controller";

const router = express.Router();

router.post(
  "/toggleChatMessagePermission/:patient_id",
  Authenticate,
  isDoctor,
  DoctorController.toggleChatMessagePermission
);

router.post(
  "/toggleVideoCallPermission/:patient_id",
  Authenticate,
  isDoctor,
  DoctorController.toggleVideoCallPermission
);

router.get("/", Authenticate, FeaturesController.getAllFeaturesMappingForUser);

module.exports = router;
