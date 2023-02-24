import express from "express";
import VitalController from "../../../app/controllers/vitals/vital.controller";
import Authenticate from "../middleware/auth";
import { isDoctor } from "../middleware/doctor";
// import * as validator from "./validator";
const router = express.Router();

router.get("/", Authenticate, VitalController.search);

router.get("/details", Authenticate, VitalController.getVitalFormDetails);

router.get(
  "/missed",
  Authenticate,
  isDoctor,
  VitalController.getAllMissedVitals
);

router.get(
  "/:id/timeline",
  Authenticate,
  VitalController.getVitalResponseTimeline
);

router.post(
  "/",
  Authenticate,
  // validator.validateVitalsForm,
  VitalController.create
);

router.post(
  "/:id",
  Authenticate,
  // validator.validateVitalsForm,
  VitalController.updateVital
);

router.delete("/:id", Authenticate, VitalController.delete);

export default router;
